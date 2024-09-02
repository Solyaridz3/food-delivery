import HttpException from "../../utils/exceptions/HttpException.js";
import DriverService from "./service.js";
import { Router } from "express";
import { authMiddleware as authenticated } from "../../middleware/auth.middleware.js";

class DriverController {
    path = "/drivers";
    router = new Router();
    #driverService = new DriverService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(
            `${this.path}/register`,
            authenticated,
            this.becomeDriver
        );
        this.router.get(
            `${this.path}/become_unavailable`,
            authenticated,
            this.setUnavailableStatus
        );

        this.router.get(
            `${this.path}/become_available`,
            authenticated,
            this.setAvailableStatus
        );
    }

    changeStatus = (status) => async (req, res, next) => {
        try {
            const userId = req.user;
            const newStatus = await this.#driverService.changeStatus(
                status,
                userId
            );
            res.status(200).json(newStatus);
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    };

    setUnavailableStatus = this.changeStatus("unavailable");

    setAvailableStatus = this.changeStatus("available");

    setDeliveringStatus = this.changeStatus("delivering");

    becomeDriver = async (req, res, next) => {
        try {
            const userId = req.user;
            const driver = await this.#driverService.registerDriver(userId);
            res.status(201).json({ driver });
        } catch (err) {
            next(new HttpException(400, err.message));
        }
    };
}

export default DriverController;
