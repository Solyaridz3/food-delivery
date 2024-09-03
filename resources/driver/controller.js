import HttpException from "../../utils/exceptions/HttpException.js";
import DriverService from "./service.js";
import { Router } from "express";
import { authMiddleware as authenticated } from "../../middleware/auth.middleware.js";

class DriverController {
  path = "/drivers";
  router = new Router();
  _driverService = new DriverService();

  constructor() {
    this.initializeRoutes();
  }

  // Sets up the routes for driver-related endpoints
  initializeRoutes() {
    this.router.post(`${this.path}/register`, authenticated, this.becomeDriver); // Route for users to register as drivers
    this.router.get(
      `${this.path}/become_unavailable`,
      authenticated,
      this.setUnavailableStatus,
    ); // Route to set driver status to unavailable

    this.router.get(
      `${this.path}/become_available`,
      authenticated,
      this.setAvailableStatus,
    ); // Route to set driver status to available
  }

  /**
   * Creates a middleware function to change driver status.
   * @param {string} status - The status to set for the driver (e.g., 'available', 'unavailable').
   * @returns {Function} A middleware function to handle the status change.
   */
  changeStatus = (status) => async (req, res, next) => {
    try {
      const userId = req.user; // Extracts user ID from the request
      const newStatus = await this._driverService.changeStatus(status, userId); // Updates the driver's status
      res.status(200).json(newStatus); // Responds with the new status
    } catch (err) {
      next(new HttpException(400, err.message)); // Handles errors and responds with a 400 status
    }
  };

  // Route handler to set driver status to unavailable
  setUnavailableStatus = this.changeStatus("unavailable");

  // Route handler to set driver status to available
  setAvailableStatus = this.changeStatus("available");

  // Route handler to set driver status to delivering
  setDeliveringStatus = this.changeStatus("delivering");

  // Route handler to register a user as a driver
  becomeDriver = async (req, res, next) => {
    try {
      const userId = req.user; // Extracts user ID from the request
      const driver = await this._driverService.registerDriver(userId); // Registers the user as a driver
      res.status(201).json({ driver }); // Responds with the registered driver details
    } catch (err) {
      next(new HttpException(400, err.message)); // Handles errors and responds with a 400 status
    }
  };
}

export default DriverController;
