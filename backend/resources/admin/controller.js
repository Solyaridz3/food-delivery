import { Router } from "express";
import AdminService from "./service.js";
import { isAdmin } from "../../middleware/auth.middleware.js";
import HttpException from "../../utils/exceptions/HttpException.js";
class AdminController {
    path = "/admin";
    router = new Router();
    #adminService = new AdminService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // users
        this.router.get(`${this.path}/users`, isAdmin, this.getAllUsers);
        this.router.delete(`${this.path}/users/:id`, isAdmin, this.deleteUser);
        // items
        this.router.delete(`${this.path}/items/:id`, isAdmin, this.deleteItem);
        // orders
        this.router.get(`${this.path}/orders`, isAdmin, this.getAllOrders);
        // drivers
    }
    
    getAllOrders = async (req, res, next) => {
        try {
            const orders = await this.#adminService.getAllOrders();
            res.status(200).json({ orders });
        } catch (err) {
            throw new HttpException(403, err.message);
        }
    };

    deleteItem = async (req, res, next) => {};

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
}

export default AdminController;
