import pg from "pg";

const { Pool } = pg;

// Creation of Pool instance

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
