import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host:
        process.env.TEST === "true"
            ? process.env.DB_TEST_HOST
            : process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const connectionData = {
    host:
        process.env.TEST === "true"
            ? process.env.DB_TEST_HOST
            : process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
}

console.log(connectionData);
console.log(process.env.BUCKET_NAME);
console.log(process.env.SECRET_KEY);

export const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to the database successfully");
        await client.release();
    } catch (err) {
        console.error("Unable to connect to the database:", err.message);
        process.exit(1); // Exit the process with failure
    }
};

export default pool;
