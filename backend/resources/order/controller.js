import { Router } from "express";
import OrderService from "./service.js";
import HttpException from "../../utils/exceptions/HttpException.js";

class OrderController {
    path = "/order";
    router = new Router();
    #orderService = new OrderService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/setup`, this.setup);
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
            const total = req.body.total;
            const orderId = await this.#orderService.create(
                req.userId,
                total,
                "preparing"
            );
            res.send(201, { order_id: orderId });
        } catch (err) {
            throw new HttpException(400, err.message);
        }
    };

    createOrder(items) {}
}

export default OrderController;
