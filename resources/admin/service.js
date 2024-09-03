import pool from "../../db.js";
import queries from "./queries.js";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../../utils/s3.js";
import crypto from "crypto";

class AdminService {
  constructor() {
    this.s3 = s3;
  }

  // Orders

  getAllOrders = async () => {
    const queryResult = await pool.query(queries.getAllOrders);
    return queryResult.rows;
  };

  updateOrderStatus = async (newStatus, orderId) => {
    const queryResult = await pool.query(queries.updateOrderStatus, [
      newStatus,
      orderId,
    ]);
    return queryResult.rows[0];
  };

  deleteOrder = async (orderId) => {
    await pool.query(queries.deleteOrder, [orderId]);
  };

  // Users
  getAllUsers = async () => {
    const queryResult = await pool.query(queries.getAllUsers);
    return queryResult.rows;
  };

  deleteUser = async (userId) => {
    await pool.query(queries.deleteUserRelatedDriver, [userId]);
    await pool.query(queries.deleteUser, [userId]);
  };
  // Items

  getImageUrl = async () => {};

  uniqueImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

  putImageToS3 = async (image, imageKey) => {
    const putObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageKey,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    const putCommand = new PutObjectCommand(putObjectParams);

    await this.s3.send(putCommand);
  };

  createImageUrl = async (imageKey) => {
    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageKey,
    };
    const getCommand = new GetObjectCommand(getObjectParams);

    const imageUrl = await getSignedUrl(this.s3, getCommand, {
      expiresIn: 3600,
    });

    return imageUrl;
  };

  createItem = async (name, price, preparationTime, image) => {
    const imageKey = this.uniqueImageName();

    await this.putImageToS3(image, imageKey);

    const imageUrl = await this.createImageUrl(imageKey);

    const item = await pool.query(queries.createItem, [
      name,
      price,
      preparationTime,
      imageUrl,
    ]);

    return item.rows;
  };

  deleteItem = async (itemId) => {
    await pool.query(queries.deleteItem, [itemId]);
  };

  // Drivers

  getAllDrivers = async () => {
    const queryResult = await pool.query(queries.getAllDrivers);
    const drivers = queryResult.rows;
    return drivers;
  };
}

export default AdminService;
