import pool from "../../db.js";
import queries from "./queries.js";

class AdminService {
    getAllOrders = async () => {
        const queryResult = await pool.query(queries.getAllOrders);
        return queryResult.rows;
    };
    getAllUsers = async () => {
        const queryResult = await pool.query(queries.getAllUsers);
        return queryResult.rows;
    };

    deleteUser = async (userId) => {
        await pool.query(queries.deleteUser, [userId]);
    };
}

export default AdminService;
