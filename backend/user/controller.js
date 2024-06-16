import { Router } from "express";
import UserService from "./service.js";

class UserController {
    path = "/users";
    router = new Router();
    #userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/setup`, this.setup);
        this.router.post(`${this.path}/register`, this.register);
        this.router.post(`${this.path}/login`, this.login);
        this.router.get(`${this.path}/`, this.getUsers);
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

    register = async (req, res, next) => {
        try {
            const userRole = "user";
            const { name, email, password } = req.body;
            const token = await this.#userService.register(
                name,
                email,
                password,
                userRole
            );
            return res.status(201).json({ token });
        } catch (err) {
            console.log(err);
            next(new HttpException(400, error.message));
        }
    };

    login = async (req, res, next) => {
        try {
            const { name, email } = req.body;
            const user = await this.#userService.login(name, email);
            return res.status(200).json({ user });
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    };

    getUsers = async (req, res, next) => {
        try {
            const data = await this.#userService.getUsers();
            return res.status(200).json(data.rows);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    };
}

export default UserController;
