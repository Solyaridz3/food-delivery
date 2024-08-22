import pool from "../../db.js";
import queries from "./queries.js";
import getDistance from "../../utils/location.js";

class OrderService {
    setup = async () => {
        await pool.query(queries.setup);
    };

    calculateDeliveryTime = async (address, preparationTime) => {
        const distanceInfo = await getDistance(address);

        const timeToDrive = distanceInfo.duration.text;

        const totalTime = preparationTime + parseInt(timeToDrive);

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

    create = async (
        userId,
        totalPrice,
        deliveryStatus,
        preparationTime,
        address
    ) => {
        const deliveryTime = await this.calculateDeliveryTime(
            address,
            preparationTime
        );
        console.log(deliveryTime);

        const orderId = await pool.query(queries.create, [
            userId,
            totalPrice,
            deliveryStatus,
            deliveryTime,
        ]);
        return orderId.rows[0];
    };

    getOrder = async (orderId) => {
        const order = await pool.query(queries.getOne, [orderId]);
        return order.rows[0];
    };
}

export default OrderService;
