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
        this.router.get(`${this.path}/setup`, this.setup);
        this.router.get(`${this.path}/`, this.getUsers);
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
        this.router.patch(
            `${this.path}/`,
            authMiddleware,
            this.updateUser
        )
    }
    setup = async (req, res, next) => {
        try {
            await this.#userService.setup();
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    };

    getUsers = async (req, res, next) => {
        try {
            const data = await this.#userService.getUsers();
            return res.status(200).json(data.rows);
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    };

    register = async (req, res, next) => {
        try {
            const userRole = "user";
            const { name, email, phone, password} = req.body;
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
            next(new HttpException(400, err.message));
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await this.#userService.login(email, password);
            return res.status(200).json({ user });
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
            const id = req.user;
            const { password, name, email, new_password, phone } = req.body;

            if (!password)
                return next(
                    new HttpException(400, "You have to enter current password")
                );

            const data = { id, password, name, email, new_password };

            const updatedUser = await this.#userService.update(data);

            return res.status(200).json({ user: updatedUser });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}

export default UserController;
