import pool from "../../db.js";

class ItemService {
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

    create = async (name, price, description, ingredients, image) => {
        await pool.query(
            "INSERT INTO items (name, price, description, ingredients, image) VALUES ($1, $2, $3, $4, $5)",
            [name, price, description, ingredients, image]
        );
    };

    change = async () => {};

    delete = async () => {};
}

export default ItemService;
