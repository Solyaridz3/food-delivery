import { Router } from "express";
import HttpException from "../../utils/exceptions/HttpException.js";
import ItemService from "./service.js";

class ItemController {
    path = "/items";
    router = new Router();
    #itemService = new ItemService();
    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/`, this.getAll);
        this.router.get(`${this.path}/selection`, this.getList);
    }

    getAll = async (req, res, next) => {
        try {
            const items = await this.#itemService.getAll();
            res.status(200).json({ items });
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    };

    getList = async (req, res, next) => {
        try {
            const itemsIds = req.body.items_ids;
            const items = await this.#itemService.getList(itemsIds);
            res.status(200).json({ items });
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    };
}

export default ItemController;
