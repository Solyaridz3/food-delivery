import pool from "../../db.js";
import queries from "./queries.js";
import getDistance from "../../utils/location.js";
import asyncTimeout from "../../utils/asyncTImeout.js";
import DriverService from "../driver/service.js";

class OrderService {
  #driverService = new DriverService();

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

  setDelivered = async (orderId, minutes) => {
    const ms = minutes * 60 * 1000;
    await asyncTimeout(ms);
    await pool.query(queries.setDelivered, ["delivered", orderId]);
  };

  getAvailableDriver = async () => {
    const availableDrivers = await this.#driverService.getAvailableDrivers();
    if (availableDrivers.length === 0) {
      throw new Error("No available drivers at the moment");
    }
    return availableDrivers[0];
  };

  getItemsData = async (itemIds) => {
    const result = await pool.query(queries.getItemsData, [itemIds]);
    return result.rows;
  };

  calculateOrderTotals = (items, itemsData) => {
    let totalPreparationTime = 0;
    let totalPrice = 0;

    items.forEach((item) => {
      const itemData = itemsData.find((row) => row.id === item.id);
      totalPrice += itemData.price * item.quantity;
      totalPreparationTime += itemData.preparation_time;
    });

    return { totalPreparationTime, totalPrice };
  };

  calculateDeliveryCost = (timeToDriveMinutes) => {
    return timeToDriveMinutes * 0.5;
  };

  async createOrder(userId, driverId, totalPrice, deliveryTime) {
    const result = await pool.query(queries.create, [
      userId,
      driverId,
      totalPrice,
      deliveryTime,
    ]);
    return result.rows[0].id;
  }

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

  create = async (userId, items, address) => {
    try {
      // Step 1: Fetch item data
      const itemIds = items.map((item) => item.id);
      const itemsData = await this.getItemsData(itemIds);

      // Step 2: Calculate totals
      const { totalPreparationTime, totalPrice: itemTotalPrice } =
        this.calculateOrderTotals(items, itemsData);

      // Step 3: Get delivery details
      const { timeToDriveMinutes } = await getDistance(address);
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
      this.#driverService.changeStatus("delivering", driver.id);

      return orderId;
    } catch (error) {
      throw new Error("Error creating order: " + error.message);
    }
  };

  getOrder = async (orderId, userId) => {
    try {
      const queryResult = await pool.query(queries.getOrderById, [orderId]);
      if (queryResult.rows.length === 0 || order_user_id) {
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

  getUserOrders = async (userId) => {
    try {
      const queryResult = await pool.query(queries.getUserOrders, [userId]);
      return queryResult.rows;
    } catch (error) {
      throw new Error("Error fetching user orders: " + error.message);
    }
  };

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
