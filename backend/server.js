import express from "express";
import pool from "./db.js";

const PORT = 3000;

const app = express();

app.use(express.json());

// routes
app.get("/", async (req, res) => {
    try {
        const data = await pool.query("SELECT * FROM users");
        res.sendStatus(200).send(data.rows);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post("/", async (req, res) => {
    const { name, location } = req.body;
    try {
        await pool.query("INSERT INTO users (name, address) VALUES ($1, $2)", [
            name,
            location,
        ]);
        res.sendStatus(200).send({ message: "User successfully created" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get("/setup", async (req, res) => {
    try {
        await pool.query(
            "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100))"
        );
        res.status(200).send({ message: "Successfully created table" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
