import pool from "../../db.js";
import queries from "./queries.js";

class OrderService {
    setup = async () => {
        await pool.query(queries.setup);
    };

    create = async (userId, orderTotal, deliveryStatus) => {
        const orderId = await pool.query(queries.create, [
            userId,
            orderTotal,
            deliveryStatus,
        ]);
        return orderId;
    };
    getOrder = async (orderId) => {
        const order = await pool.query(queries.getOrder, [orderId]);
        return order;
    };
}

export default OrderService;
