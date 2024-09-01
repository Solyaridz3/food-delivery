import pool from "../../db.js";
import queries from "./queries.js";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import createS3Client from "../../utils/s3.js";
import crypto from "crypto";

class AdminService {
    constructor() {
        this.s3 = createS3Client();
    }

    // Orders

    getAllOrders = async () => {
        const queryResult = await pool.query(queries.getAllOrders);
        return queryResult.rows;
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

    createItem = async (name, price, preparation_time, image) => {
        const uniqueImageName = (bytes = 32) =>
            crypto.randomBytes(bytes).toString("hex");

        const imageName = uniqueImageName();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: imageName,
            Body: image.buffer,
            ContentType: image.mimetype,
        };

        const command = new PutObjectCommand(params);

        await this.s3.send(command);

        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: imageName,
        };
        const getCommand = new GetObjectCommand(getObjectParams);

        const image_url = await getSignedUrl(this.s3, getCommand, {
            expiresIn: 3600,
        });

        const item = await pool.query(queries.createItem, [
            name,
            price,
            preparation_time,
            image_url,
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
