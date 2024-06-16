import pool from "../../db.js";

class ItemService {
    create = async (name, price, description, ingredients, image) => {
        await pool.query(
            "INSERT INTO items (name, price, description, ingredients, image) VALUES ($1, $2, $3, $4, $5)",
            [name, price, description, ingredients, image]
        );
    };

    change = async () => {};

    delete = async () => {};
}
