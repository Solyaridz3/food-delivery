import { Router } from "express";
import OrderService from "./service.js";
import HttpException from "../../utils/exceptions/HttpException.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import validate from "./validation.js";

class OrderController {
    path = "/orders";
    router = new Router();
    #orderService = new OrderService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/setup`, this.setup);
        this.router.get(`${this.path}/`, authMiddleware, this.getOrder);

        this.router.post(
            `${this.path}/`,
            [authMiddleware, validationMiddleware(validate.makeOrder)],
            this.makeOrder
        );

        this.router.get(
            `${this.path}/user-orders`,
            authMiddleware,
            this.getUserOrders
        );

        this.router.get(
            `${this.path}/order-items`,
            authMiddleware,
            this.getOrderItems
        );
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
            const order = await this.#orderService.getOrder(orderId);
            res.status(200).json(order);
        } catch (err) {
            next(new HttpException(404, err.message));
        }
    };

    getUserOrders = async (req, res, next) => {
        try {
            const userId = req.user;
            const userOrders = await this.#orderService.getUserOrders(userId);
            res.status(200).json({ user_orders: userOrders });
        } catch (err) {
            next(new HttpException(404, err.message));
        }
    };

    makeOrder = async (req, res, next) => {
        try {
            const userId = req.user;
            const { items, address } = req.body;
            const orderId = await this.#orderService.create(
                userId,
                items,
                address
            );
            res.status(201).json({ order_id: orderId });
        } catch (err) {
            next(new HttpException(404, err.message));
        }
    };

    getOrderItems = async (req, res, next) => {
        try {
            const orderId = req.query.order_id;
            const items = await this.#orderService.getOrderItems(orderId);
            res.status(200).json({ items });
        } catch (err) {
            next(new HttpException(404, err.message));
        }
    };
}

export default OrderController;
