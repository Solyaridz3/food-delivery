import pool from "../../db.js";
import queries from "./queries.js";
import getDistance from "../../utils/location.js";
import asyncTimeout from "../../utils/asyncTImeout.js";

class OrderService {
    setup = async () => {
        await pool.query(queries.setup);
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

    create = async (
        userId,
        totalPrice,
        deliveryStatus,
        preparationTime,
        address
    ) => {
        const distanceInfo = await getDistance(address);
        const timeToDrive = distanceInfo.duration.text;
        const totalTime = preparationTime + parseInt(timeToDrive);
        const deliveryTime = await this.calculateDeliveryTime(totalTime);
        const deliveryCost = timeToDrive * 0.5;
        totalPrice += deliveryCost;
        const queryResult = await pool.query(queries.create, [
            userId,
            totalPrice,
            deliveryStatus,
            deliveryTime,
        ]);
        const orderId = queryResult.rows[0].order_id;
        this.setDelivered(orderId, totalTime);

        return orderId;
    };

    getOrder = async (orderId) => {
        const order = await pool.query(queries.getOne, [orderId]);
        return order.rows[0];
    };
}

export default OrderService;
