import pg from "pg";
import asyncTimeout from "./utils/asyncTImeout.js";

const { Pool } = pg;

const pool = new Pool({
    host: "db",
    port: 5432,
    user: "user",
    password: "food-del",
    database: "food-db",
});


export const testConnection = async () => {
    try {
        await asyncTimeout(15000);
        const client = await pool.connect();
        console.log("Connected to the database successfully");
        await client.release();
    } catch (err) {
        console.error("Unable to connect to the database:", err.message);
        process.exit(1); // Exit the process with failure
    }
};

export default pool;
