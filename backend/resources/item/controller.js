import { Router } from "express";
import HttpException from "../../utils/exceptions/HttpException.js";
import ItemService from "./service.js";
import multer from "multer";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class ItemController {
    path = "/items";
    router = new Router();
    #itemService = new ItemService();
    constructor() {
        this.initializeRoutes();
    }

    setup = async (req, res, next) => {
        try {
            await this.#itemService.setup();
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    };

    initializeRoutes() {
        this.router.get(`${this.path}/setup`, this.setup);
        this.router.get(`${this.path}/`, this.getAll);
        this.router.post(
            `${this.path}/`,
            [authMiddleware, upload.single("image")],
            this.createItem
        );
        this.router.get(`${this.path}/selection`, this.getList);
    }

    getAll = async (req, res, next) => {
        try {
            const data = await this.#itemService.getAll();
            res.status(200).json(data);
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    };
    
    getList = async(req, res, next) =>{
        try {
            const itemsIds = req.body.items_ids;
            const items = await this.#itemService.getList(itemsIds);
            res.status(200).json(items);
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    }

    createItem = async (req, res, next) => {
        try {
            console.log(req.user);
            const image = req.file;
            const { name, price, preparation_time } = req.body;
            const item = await this.#itemService.create(
                name,
                price,
                preparation_time,
                image
            );
            return res.status(201).json({ item });
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    };
}

export default ItemController;
