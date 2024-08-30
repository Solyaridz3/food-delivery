import pool from "../../db.js";
import queries from "./queries.js";

class ItemService {
    getAll = async () => {
        const data = await pool.query(queries.getAll);
        return data.rows;
    };

    getOne = async (id) => {
        const data = await pool.query(queries.getById, [id]);
        return data;
    };

    getList = async (itemsIds) => {
        const queryResult = await pool.query(queries.getList, [itemsIds]);
        return queryResult.rows;
    };
}

export default ItemService;
