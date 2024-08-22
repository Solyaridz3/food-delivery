import pool from "../../db.js";
import queries from "./queries.js";
import getDistance from "../../utils/location.js";

class OrderService {
    setup = async () => {
        await pool.query(queries.setup);
    };

    create = async (
        userId,
        totalPrice,
        deliveryStatus,
        totalPreparationTime,
        address
    ) => {
        const distanceInfo = await getDistance(address);
        const timeToDrive = distanceInfo.duration.text;

        const totalTime = totalPreparationTime + parseInt(timeToDrive);
        console.log(totalTime);
        const date = new Date();
        date.setMinutes(date.getMinutes() + totalTime);
        let options = { timeZone: "Europe/Kyiv" };
        let deliveryTime = date.toLocaleString("en-US", options).split(", ")[1];

        // const orderId = await pool.query(queries.create, [
        //     userId,
        //     totalPrice,
        //     deliveryAddress,
        //     deliveryStatus,
        // ]);
        return deliveryTime;
    };

    getOrder = async (orderId) => {
        const order = await pool.query(queries.getOne, [orderId]);
        return order;
    };
}

export default OrderService;
