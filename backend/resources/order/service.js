import pool from "../../db.js";
import queries from "./queries.js";
import getDistance from "../../utils/location.js";
import asyncTimeout from "../../utils/asyncTImeout.js";

class OrderService {
    setup = async () => {
        await pool.query(queries.setup);
        await pool.query(queries.setupOrderItems);
    };

    calculateDeliveryTime = async (totalTime) => {
        const date = new Date();
        date.setMinutes(date.getMinutes() + totalTime);
        let options = {
            timeZone: "Europe/Kyiv",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };

        const deliveryTime = date.toLocaleString([], options);
        return deliveryTime;
    };

    setDelivered = async (orderId, minutes) => {
        const ms = minutes * 60 * 1000;
        await asyncTimeout(ms);
        await pool.query(queries.setDelivered, ["delivered", orderId]);
    };

    create = async (userId, items, address) => {
        let itemIds = items.map((item) => item.item_id);

        const itemsData = await pool.query(
            `SELECT item_id, price, preparation_time FROM items WHERE item_id = ANY($1::int[])`,
            [itemIds]
        );
        let totalPreparationTime = 0;
        let totalPrice = 0;
        items.forEach((item) => {
            const itemData = itemsData.rows.find((row) => row.item_id === item.item_id);
            const itemTotalPrice = itemData.price * item.quantity;
            totalPrice += itemTotalPrice;
            totalPreparationTime += itemData.preparation_time;
        });

        const distanceInfo = await getDistance(address);
        const timeToDrive = distanceInfo.duration.text;
        const totalTime = totalPreparationTime + parseInt(timeToDrive);
        const deliveryTime = await this.calculateDeliveryTime(totalTime);
        const deliveryCost = parseInt(timeToDrive) * 0.5;
        totalPrice += deliveryCost;
        const queryResult = await pool.query(queries.create, [
            userId,
            totalPrice,
            "pending",
            deliveryTime,
        ]);

        const orderId = queryResult.rows[0].order_id;

        const orderItemsPromises = items.map((item) =>
            pool.query(
                "INSERT INTO order_items (order_id, item_id, quantity, item_price) VALUES ($1, $2, $3, $4)",
                [
                    orderId,
                    item.item_id,
                    item.quantity,
                    itemsData.rows.find((row) => row.item_id === item.item_id)
                        .price,
                ]
            )
        );
        await Promise.all(orderItemsPromises);

        this.setDelivered(orderId, totalTime);

        return orderId;
    };

    getOrder = async (orderId) => {
        const order = await pool.query(queries.getOne, [orderId]);
        return order.rows[0];
    };

    getUserOrders = async (userId) => {
        const queryResult = await pool.query(queries.getUserOrders, [userId]);
        return queryResult.rows;
    };

    getOrderItems = async(orderId) => {
        const queryResult = await pool.query(queries.getOrderItems, [orderId]);
        return queryResult.rows;
    }
}

export default OrderService;
