import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    host: "db",
    port: 5432,
    user: "user",
    password: "bebra",
    database: "food-db",
});


const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to the database successfully");
        client.release();
    } catch (err) {
        console.error("Unable to connect to the database:", err.message);
        process.exit(1); // Exit the process with failure
    }
};

testConnection();

export default pool;
