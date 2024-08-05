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
        this.router.get("/", this.getAll);
        this.router.post("/", this.createItem);
    }

    getAll = async (req, res, next) => {
        try {
            const data = await this.#itemService.getAll();
            res.status(200).json(data.rows);
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    };

    createItem = async (req, res, next) => {
        try {
            const { name, price, description, ingredients, image, preparation_time } = req.body;
            const item = await this.#itemService.create(
                name,
                price,
                description,
                ingredients,
                image,
                preparation_time
            );
            return res.status(201).json({ item });
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    };
}

export default ItemController;
