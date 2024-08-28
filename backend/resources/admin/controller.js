import { Router } from "express";
import AdminService from "./service.js";
import { isAdmin } from "../../middleware/auth.middleware.js";

class AdminController {
    path = "/admin";
    router = new Router();
    #adminService = new AdminService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // users
        console.log(isAdmin);
        this.router.get(`${this.path}/users`, isAdmin, this.getAllUsers);
        this.router.delete(`${this.path}/users/:id`, isAdmin, this.deleteUser);

        // items
        this.router.delete(`${this.path}/items/:id`, isAdmin, this.deleteItem);

        // orders

        // drivers
    }
    deleteItem = async () => {};

    getAllUsers = async (req, res, next) => {
        try {
            const users = await this.#adminService.getAllUsers();
            res.status(200).json({ users });
        } catch (err) {
            next(err);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.#adminService.deleteUser(id);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    };
}

export default AdminController;
