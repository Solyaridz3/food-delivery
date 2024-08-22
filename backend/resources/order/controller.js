import { Router } from "express";
import OrderService from "./service.js";
import HttpException from "../../utils/exceptions/HttpException.js";

class OrderController {
    path = "/orders";
    router = new Router();
    #orderService = new OrderService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/setup`, this.setup);
        this.router.post(`${this.path}/`, this.makeOrder);
    }

    setup = async (req, res, next) => {
        try {
            await this.#orderService.setup();
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    };

    makeOrder = async (req, res, next) => {
        try {
            const userId = "123";
            const { total, total_preparation_time, address } = req.body;
            const orderId = await this.#orderService.create(
                userId,
                total,
                "preparing",
                total_preparation_time,
                address
            );
            res.send(201, { order_id: orderId });
        } catch (err) {
            throw new HttpException(400, err.message);
        }
    };
}

export default OrderController;
