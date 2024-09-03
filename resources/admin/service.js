import pool from "../../db.js";
import queries from "./queries.js";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../../utils/s3.js";
import crypto from "crypto";

class AdminService {
  constructor() {
    this.s3 = s3; // Initialize S3 client
  }

  // Orders

  /**
   * Retrieves all orders from the database.
   * @returns {Promise<Object[]>} A promise that resolves to an array of order objects.
   */
  getAllOrders = async () => {
    const queryResult = await pool.query(queries.getAllOrders); // Executes the query to get all orders
    return queryResult.rows; // Returns the list of orders
  };

  /**
   * Updates the status of a specific order.
   * @param {string} newStatus - The new status to set for the order.
   * @param {number} orderId - The ID of the order to update.
   * @returns {Promise<Object>} A promise that resolves to the updated order object.
   */
  updateOrderStatus = async (newStatus, orderId) => {
    const queryResult = await pool.query(queries.updateOrderStatus, [
      newStatus,
      orderId,
    ]); // Executes the query to update the order status
    return queryResult.rows[0]; // Returns the updated order
  };

  /**
   * Deletes a specific order from the database.
   * @param {number} orderId - The ID of the order to delete.
   * @returns {Promise<void>} A promise that resolves when the order is deleted.
   */
  deleteOrder = async (orderId) => {
    await pool.query(queries.deleteOrder, [orderId]); // Executes the query to delete the order
  };

  // Users

  /**
   * Retrieves all users from the database.
   * @returns {Promise<Object[]>} A promise that resolves to an array of user objects.
   */
  getAllUsers = async () => {
    const queryResult = await pool.query(queries.getAllUsers); // Executes the query to get all users
    return queryResult.rows; // Returns the list of users
  };

  /**
   * Deletes a specific user and their related driver record.
   * @param {number} userId - The ID of the user to delete.
   * @returns {Promise<void>} A promise that resolves when the user and their driver record are deleted.
   */
  deleteUser = async (userId) => {
    await pool.query(queries.deleteUserRelatedDriver, [userId]); // Deletes the user's related driver record
    await pool.query(queries.deleteUser, [userId]); // Deletes the user
  };

  // Items

  /**
   * Generates a unique image name using random bytes.
   * @param {number} [bytes=32] - The number of random bytes to use for the image name.
   * @returns {string} A unique image name.
   */
  uniqueImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

  /**
   * Uploads an image to S3.
   * @param {Object} image - The image object containing buffer and mimetype.
   * @param {string} imageKey - The key (name) for the image in S3.
   * @returns {Promise<void>} A promise that resolves when the image is uploaded.
   */
  putImageToS3 = async (image, imageKey) => {
    const putObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageKey,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    const putCommand = new PutObjectCommand(putObjectParams);

    await this.s3.send(putCommand); // Uploads the image to S3
  };

  /**
   * Creates a signed URL for an image stored in S3.
   * @param {string} imageKey - The key (name) of the image in S3.
   * @returns {Promise<string>} A promise that resolves to the signed URL for the image.
   */
  createImageUrl = async (imageKey) => {
    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageKey,
    };
    const getCommand = new GetObjectCommand(getObjectParams);

    const imageUrl = await getSignedUrl(this.s3, getCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return imageUrl; // Returns the signed URL
  };

  /**
   * Creates a new item, uploads its image to S3, and stores the item details in the database.
   * @param {string} name - The name of the item.
   * @param {number} price - The price of the item.
   * @param {number} preparationTime - The preparation time for the item.
   * @param {Object} image - The image object containing buffer and mimetype.
   * @returns {Promise<Object[]>} A promise that resolves to an array containing the created item object.
   */
  createItem = async (name, price, preparationTime, image) => {
    const imageKey = this.uniqueImageName(); // Generates a unique name for the image

    await this.putImageToS3(image, imageKey); // Uploads the image to S3

    const imageUrl = await this.createImageUrl(imageKey); // Creates a signed URL for the image

    const item = await pool.query(queries.createItem, [
      name,
      price,
      preparationTime,
      imageUrl,
    ]); // Creates the item in the database

    return item.rows; // Returns the created item
  };

  /**
   * Deletes a specific item from the database.
   * @param {number} itemId - The ID of the item to delete.
   * @returns {Promise<void>} A promise that resolves when the item is deleted.
   */
  deleteItem = async (itemId) => {
    await pool.query(queries.deleteItem, [itemId]); // Executes the query to delete the item
  };

  // Drivers

  /**
   * Retrieves all drivers from the database.
   * @returns {Promise<Object[]>} A promise that resolves to an array of driver objects.
   */
  getAllDrivers = async () => {
    const queryResult = await pool.query(queries.getAllDrivers); // Executes the query to get all drivers
    const drivers = queryResult.rows; // Extracts the rows from the query result
    return drivers; // Returns the list of drivers
  };
}

export default AdminService;
