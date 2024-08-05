import { Router } from "express";
import OrderService from "./service.js";

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

    createOrder(items) {}
}


export default OrderController;