import pool from "../../db.js";
import queries from "./queries.js"; // Importing SQL queries for orders
import getRoadInfo from "../../utils/location.js"; // Utility to get road information like time to drive
import asyncTimeout from "../../utils/asyncTImeout.js"; // Utility to create async delays
import DriverService from "../driver/service.js";

class OrderService {
  _driverService = new DriverService();

  /**
   * Calculates the estimated delivery time by adding preparation and delivery time to the current time.
   * @param {number} totalTime - The total time in minutes.
   * @returns {string} - Estimated delivery time in "HH:mm" format.
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
    return date.toLocaleString([], options);
  };

  /**
   * Sets the status of an order to "delivered" after a specified delay.
   * @param {number} orderId - The ID of the order.
   * @param {number} minutes - Delay in minutes.
   * @returns {Promise<void>} - A promise that resolves when the status is updated.
   */
  setDelivered = async (orderId, minutes) => {
    const ms = minutes * 60 * 1000;
    await asyncTimeout(ms);
    await pool.query(queries.setDelivered, ["delivered", orderId]);
  };

  /**
   * Retrieves the first available driver.
   * @returns {Promise<object>} - Promise resolving to the first available driver.
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
   * @param {Array<number>} itemIds - Array of item IDs.
   * @returns {Promise<Array<object>>} - Promise resolving to items data.
   */
  getItemsData = async (itemIds) => {
    const result = await pool.query(queries.getItemsData, [itemIds]);
    return result.rows;
  };

  /**
   * Calculates total preparation time and total price for items.
   * @param {Array<object>} items - List of items in the order.
   * @param {Array<object>} itemsData - Data for these items from the database.
   * @returns {object} - Totals including preparation time and price.
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
   * @param {number} timeToDriveMinutes - The time in minutes.
   * @returns {number} - The delivery cost.
   */
  calculateDeliveryCost = (timeToDriveMinutes) => {
    return timeToDriveMinutes * 0.5;
  };

  /**
   * Creates a new order in the database.
   * @param {number} userId - The user placing the order.
   * @param {number} driverId - The assigned driver.
   * @param {number} totalPrice - The total price of the order.
   * @param {string} deliveryTime - The estimated delivery time.
   * @returns {Promise<number>} - Promise resolving to the ID of the created order.
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
   * Inserts order items into the database.
   * @param {number} orderId - The order ID.
   * @param {Array<object>} items - Items in the order.
   * @param {Array<object>} itemsData - Data for these items from the database.
   * @returns {Promise<void>} - A promise that resolves when the items are inserted.
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
   * Creates a new order, calculating totals, getting delivery details, and inserting it into the database.
   * @param {number} userId - The user placing the order.
   * @param {Array<object>} items - The items in the order.
   * @param {string} address - Delivery address.
   * @returns {Promise<number>} - Promise resolving to the ID of the created order.
   * @throws {Error} - If there is an issue creating the order.
   */
  create = async (userId, items, address) => {
    try {
      const itemIds = items.map((item) => item.id);
      const itemsData = await this.getItemsData(itemIds);

      const { totalPreparationTime, totalPrice: itemTotalPrice } =
        this.calculateOrderTotals(items, itemsData);

      const { timeToDriveMinutes } = await getRoadInfo(address);
      const deliveryCost = this.calculateDeliveryCost(timeToDriveMinutes);
      const totalPrice = itemTotalPrice + deliveryCost;
      const totalTime = totalPreparationTime + timeToDriveMinutes;
      const deliveryTime = this.calculateDeliveryTime(totalTime);

      const driver = await this.getAvailableDriver();

      const orderId = await this.createOrder(
        userId,
        driver.id,
        totalPrice,
        deliveryTime,
      );
      await this.insertOrderItems(orderId, items, itemsData);

      this.setDelivered(orderId, totalTime);
      this._driverService.changeStatus("delivering", driver.id);

      return orderId;
    } catch (error) {
      throw new Error("Error creating order: " + error.message);
    }
  };

  /**
   * Fetches the details of an order by its ID and checks ownership.
   * @param {number} orderId - The ID of the order.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<object>} - Promise resolving to order details.
   * @throws {Error} - If the order is not found or unauthorized.
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
   * Retrieves all orders for a specific user.
   * @param {number} userId - The user ID.
   * @returns {Promise<Array<object>>} - Promise resolving to the user's orders.
   * @throws {Error} - If there is an issue fetching orders.
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
   * Fetches items associated with a specific order.
   * @param {number} orderId - The ID of the order.
   * @returns {Promise<Array<object>>} - Promise resolving to the order items.
   * @throws {Error} - If there is an issue fetching items.
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
