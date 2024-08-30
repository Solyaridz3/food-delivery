import { Router } from "express";
import OrderService from "./service.js";
import HttpException from "../../utils/exceptions/HttpException.js";
import { authMiddleware as authenticated } from "../../middleware/auth.middleware.js";
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
        this.router.get(`${this.path}/details/:orderId`, authenticated, this.getOrder);

        this.router.post(
            `${this.path}/`,
            [authenticated, validationMiddleware(validate.makeOrder)],
            this.makeOrder
        );

        this.router.get(
            `${this.path}/user-orders`,
            authenticated,
            this.getUserOrders
        );

        this.router.get(
            `${this.path}/order-items`,
            authenticated,
            this.getOrderItems
        );
    }

    getOrder = async (req, res, next) => {
        try {
            const userId = req.user;
            const orderId = req.params.orderId;
            const order = await this.#orderService.getOrder(orderId, userId);
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
