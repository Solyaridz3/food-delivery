import { Router } from "express";
import UserService from "./service.js";
import HttpException from "../../utils/exceptions/HttpException.js";
import validate from "./validation.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

class UserController {
    path = "/users";
    router = new Router();
    #userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );
        this.router.patch(`${this.path}/`, authMiddleware, this.updateUser);
    }

    register = async (req, res, next) => {
        try {
            const userRole = "user";
            const { name, email, phone, password } = req.body;
            const token = await this.#userService.register(
                name,
                email,
                phone,
                password,
                userRole
            );
            
            return res.status(201).json({ token });
        } catch (err) {
            console.log(err);
            next(new HttpException(401, err.message));
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const token = await this.#userService.login(email, password);
            return res.status(200).json({ token });
        } catch (err) {
            next(new HttpException(401, err.message));
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            if (!req.user || req.user.role !== "admin") {
                return next(new HttpException(405, "Not allowed"));
            }
            const id = req.params.id;
            const deletedUser = await this.UserService.delete(id);
            return res.status(200).json({ deletedUser });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const userId = req.user;
            const { password, new_password, ...updateData } = req.body;

            if (!password) {
                return next(
                    new HttpException(
                        400,
                        "You have to enter the current password"
                    )
                );
            }

            const data = { id: userId, password, new_password, ...updateData };

            const updatedUser = await this.#userService.update(data);

            return res.status(200).json({ user: updatedUser });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}

export default UserController;
