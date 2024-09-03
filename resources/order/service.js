import pool from "../../db.js";
import queries from "./queries.js"; // Importing SQL queries for orders
import getRoadInfo from "../../utils/location.js"; // Utility to get road information like time to drive
import asyncTimeout from "../../utils/asyncTImeout.js"; // Utility to create async delays
import DriverService from "../driver/service.js";

class OrderService {
  // Private member for accessing driver-related operations
  _driverService = new DriverService();

  /**
   * Calculates the estimated delivery time by adding the total preparation and delivery time to the current time.
   * @param {number} totalTime - The total time required for preparation and delivery in minutes.
   * @returns {string} - The estimated delivery time formatted in "HH:mm" for Kyiv timezone.
   */
  calculateDeliveryTime = (totalTime) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + totalTime);
    let options = {
      timeZone: "Europe/Kyiv",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const deliveryTime = date.toLocaleString([], options);
    return deliveryTime;
  };

  /**
   * Created in order to simulate drivers activity
   * Sets the status of an order to "delivered" after a specified delay.
   * @param {number} orderId - The ID of the order to update.
   * @param {number} minutes - The delay in minutes before setting the status.
   */
  setDelivered = async (orderId, minutes) => {
    const ms = minutes * 60 * 1000;
    await asyncTimeout(ms);
    await pool.query(queries.setDelivered, ["delivered", orderId]);
  };

  /**
   * Retrieves the first available driver from the pool of drivers.
   * Throws an error if no drivers are available.
   * @returns {object} - The first available driver.
   * @throws {Error} - If no drivers are available.
   */
  getAvailableDriver = async () => {
    const availableDrivers = await this._driverService.getAvailableDrivers();
    if (availableDrivers.length === 0) {
      throw new Error("No available drivers at the moment");
    }
    return availableDrivers[0];
  };

  /**
   * Fetches data for a list of items based on their IDs.
   * @param {Array<number>} itemIds - An array of item IDs.
   * @returns {Array<object>} - The data for the items.
   */
  getItemsData = async (itemIds) => {
    const result = await pool.query(queries.getItemsData, [itemIds]);
    return result.rows;
  };

  /**
   * Calculates the total preparation time and total price for a list of items.
   * @param {Array<object>} items - The list of items in the order.
   * @param {Array<object>} itemsData - The corresponding data for these items from the database.
   * @returns {object} - An object containing the total preparation time and total price.
   */
  calculateOrderTotals = (items, itemsData) => {
    let totalPreparationTime = 0;
    let totalPrice = 0;

    items.forEach((item) => {
      const itemData = itemsData.find((row) => row.id === item.id);
      if (!itemData) {
        return; // No item in database
      }
      totalPrice += itemData.price * item.quantity;
      totalPreparationTime += itemData.preparation_time;
    });

    return { totalPreparationTime, totalPrice };
  };

  /**
   * Calculates the delivery cost based on the time required to drive.
   * @param {number} timeToDriveMinutes - The time required to drive to the delivery location in minutes.
   * @returns {number} - The delivery cost.
   */
  calculateDeliveryCost = (timeToDriveMinutes) => {
    return timeToDriveMinutes * 0.5;
  };

  /**
   * Creates a new order in the database.
   * @param {number} userId - The ID of the user placing the order.
   * @param {number} driverId - The ID of the assigned driver.
   * @param {number} totalPrice - The total price of the order.
   * @param {string} deliveryTime - The estimated delivery time.
   * @returns {number} - The ID of the created order.
   */
  async createOrder(userId, driverId, totalPrice, deliveryTime) {
    const result = await pool.query(queries.create, [
      userId,
      driverId,
      totalPrice,
      deliveryTime,
    ]);
    return result.rows[0].id;
  }

  /**
   * Inserts the items of an order into the database.
   * @param {number} orderId - The ID of the order.
   * @param {Array<object>} items - The items in the order.
   * @param {Array<object>} itemsData - The corresponding data for these items from the database.
   */
  async insertOrderItems(orderId, items, itemsData) {
    const orderItemsPromises = items.map((item) =>
      pool.query(queries.insertOrderItems, [
        orderId,
        item.id,
        item.quantity,
        itemsData.find((row) => row.id === item.id).price,
      ]),
    );
    await Promise.all(orderItemsPromises);
  }

  /**
   * Creates a new order, including fetching item data, calculating totals, getting delivery details, and inserting the order into the database.
   * @param {number} userId - The ID of the user placing the order.
   * @param {Array<object>} items - The items in the order.
   * @param {string} address - The delivery address.
   * @returns {number} - The ID of the created order.
   * @throws {Error} - If there is an issue with creating the order.
   */
  create = async (userId, items, address) => {
    try {
      // Step 1: Fetch item data
      const itemIds = items.map((item) => item.id);
      const itemsData = await this.getItemsData(itemIds);

      // Step 2: Calculate totals
      const { totalPreparationTime, totalPrice: itemTotalPrice } =
        this.calculateOrderTotals(items, itemsData);

      // Step 3: Get delivery details
      const { timeToDriveMinutes } = await getRoadInfo(address);
      const deliveryCost = this.calculateDeliveryCost(timeToDriveMinutes);
      const totalPrice = itemTotalPrice + deliveryCost;
      const totalTime = totalPreparationTime + timeToDriveMinutes;
      const deliveryTime = this.calculateDeliveryTime(totalTime);

      // Step 4: Get available driver
      const driver = await this.getAvailableDriver();

      // Step 5: Create order and order items in DB
      const orderId = await this.createOrder(
        userId,
        driver.id,
        totalPrice,
        deliveryTime,
      );
      await this.insertOrderItems(orderId, items, itemsData);

      // Step 6: Set order as delivered and change driver status
      this.setDelivered(orderId, totalTime);
      this._driverService.changeStatus("delivering", driver.id);

      return orderId;
    } catch (error) {
      throw new Error("Error creating order: " + error.message);
    }
  };

  /**
   * Fetches the details of an order by its ID and checks if it belongs to a specific user.
   * @param {number} orderId - The ID of the order.
   * @param {number} userId - The ID of the user to check ownership.
   * @returns {object} - The details of the order.
   * @throws {Error} - If the order is not found or does not belong to the user.
   */
  getOrder = async (orderId, userId) => {
    try {
      const queryResult = await pool.query(queries.getOrderById, [orderId]);
      if (queryResult.rows.length === 0) {
        throw new Error("Order not found");
      }
      const order = queryResult.rows[0];
      if (order.user_id !== userId) {
        throw new Error("Forbidden. This is not your order.");
      }
      return order;
    } catch (error) {
      throw new Error("Error fetching order: " + error.message);
    }
  };

  /**
   * Retrieves all orders associated with a specific user.
   * @param {number} userId - The ID of the user.
   * @returns {Array<object>} - A list of orders for the user.
   * @throws {Error} - If there is an issue fetching the user's orders.
   */
  getUserOrders = async (userId) => {
    try {
      const queryResult = await pool.query(queries.getUserOrders, [userId]);
      return queryResult.rows;
    } catch (error) {
      throw new Error("Error fetching user orders: " + error.message);
    }
  };

  /**
   * Fetches the items associated with a specific order.
   * @param {number} orderId - The ID of the order.
   * @returns {Array<object>} - The items in the order.
   * @throws {Error} - If there is an issue fetching the order items.
   */
  getOrderItems = async (orderId) => {
    try {
      const queryResult = await pool.query(queries.getOrderItems, [orderId]);
      return queryResult.rows;
    } catch (error) {
      throw new Error("Error fetching order items: " + error.message);
    }
  };
}

export default OrderService;
