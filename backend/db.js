import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    host: "db",
    port: 5432,
    user: "user",
    password: "bebra",
    database: "food-db",
});

export default pool;
