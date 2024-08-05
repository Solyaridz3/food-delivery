import pool from "../../db.js";
import queries from "./queries.js";

class OrderService {
    setup = async () =>{
        await pool.query(queries.setup);
    } 
}

export default OrderService;
