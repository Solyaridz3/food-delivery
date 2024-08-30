import { Router } from "express";
import AdminService from "./service.js";
import { isAdmin } from "../../middleware/auth.middleware.js";
import HttpException from "../../utils/exceptions/HttpException.js";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

class AdminController {
    path = "/admin";
    router = new Router();
    #adminService = new AdminService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Users
        this.router.get(`${this.path}/users`, isAdmin, this.getAllUsers);
        this.router.delete(`${this.path}/users/:id`, isAdmin, this.deleteUser);

        // Items
        this.router.delete(`${this.path}/items/:id`, isAdmin, this.deleteItem);
        this.router.post(
            `${this.path}/items`,
            [isAdmin, upload.single("image")],
            this.createItem
        );
        // Orders

        this.router.get(`${this.path}/orders`, isAdmin, this.getAllOrders);

        // Drivers
    }
    // Orders

    getAllOrders = async (req, res, next) => {
        try {
            const orders = await this.#adminService.getAllOrders();
            res.status(200).json({ orders });
        } catch (err) {
            throw new HttpException(403, err.message);
        }
    };

    // Users

    getAllUsers = async (req, res, next) => {
        try {
            const users = await this.#adminService.getAllUsers();
            res.status(200).json({ users });
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.#adminService.deleteUser(id);
            res.status(200).json({
                message: `User with ID ${id} has been deleted successfully.`,
            });
        } catch (err) {
            next(new HttpException(404, err.message));
        }
    };

    // Items
    createItem = async (req, res, next) => {
        try {
            const image = req.file;
            const { name, price, preparation_time } = req.body;
            const item = await this.#adminService.createItem(
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

    deleteItem = async (req, res, next) => {};
}

export default AdminController;
