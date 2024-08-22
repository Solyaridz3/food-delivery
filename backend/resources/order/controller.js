import { Router } from "express";
import OrderService from "./service.js";
import HttpException from "../../utils/exceptions/HttpException.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

class OrderController {
    path = "/orders";
    router = new Router();
    #orderService = new OrderService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/setup`, this.setup);
        this.router.post(`${this.path}/`, authMiddleware, this.makeOrder);
        this.router.get(`${this.path}/`, authMiddleware, this.getOrder);
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

    getOrder = async (req, res, next) => {
        try {
            const orderId = req.query.order_id;
            console.log(orderId);
            const order = await this.#orderService.getOrder(orderId);
            res.status(200).json(order);
        } catch (err) {
            throw new HttpException(404, err.message);
        }
    };

    makeOrder = async (req, res, next) => {
        try {
            const userId = req.user;
            const { total, preparation_time, address } = req.body;
            const orderId = await this.#orderService.create(
                userId,
                total,
                "preparing",
                preparation_time,
                address
            );
            res.status(201).json({ order_id: orderId });
        } catch (err) {
            throw new HttpException(400, err.message);
        }
    };
}

export default OrderController;
