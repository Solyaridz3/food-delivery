import pool from "../../db.js";

import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import createS3Client from "../../utils/s3.js";
import queries from "./queries.js";
import crypto from "crypto";

class ItemService {
    constructor() {
        this.s3 = createS3Client();
    }

    setup = async () => {
        await pool.query(queries.setup);
    };

    getAll = async () => {
        const data = await pool.query("SELECT * FROM items");
        return data;
    };

    getOne = async (id) => {
        const data = await pool.query("SELECT * FROM items WHERE id = $1", [
            id,
        ]);
        return data;
    };

    create = async (name, price, preparation_time, image) => {
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

        const item = await pool.query(queries.create, [
            name,
            price,
            preparation_time,
            image_url,
        ]);

        return item.rows;
    };

    change = async () => {};

    delete = async () => {};
}

export default ItemService;
