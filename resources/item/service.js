import pool from "../../db.js";
import queries from "./queries.js";

class ItemService {
    getAll = async () => {
        const data = await pool.query(queries.getAll);
        const items = data.rows;
        return items;
    };

    getItem = async (itemId) => {
        const data = await pool.query(queries.getById, [itemId]);
        const item = data.rows[0];
        return item;
    };

    getSelection = async (itemsIds) => {
        const queryResult = await pool.query(queries.getSelection, [itemsIds]);
        const items = queryResult.rows;
        return items;
    };
}

export default ItemService;
