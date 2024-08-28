import pool from "../../db.js";
import queries from "./queries.js";

class AdminService {
    async getAllUsers() {
        const queryResult = await pool.query(queries.getAllUsers);
        return queryResult.rows;
    }

    async deleteUser(userId) {
        await pool.query(queries.deleteUser, [userId]);
    }
}

export default AdminService;
