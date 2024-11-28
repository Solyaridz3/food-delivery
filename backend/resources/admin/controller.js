import { Router } from "express";
import AdminService from "./service.js";
import { isAdmin } from "../../middleware/auth.middleware.js";
import HttpException from "../../utils/exceptions/HttpException.js";
import multer from "multer";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import validate from "./validation.js";

const storage = multer.memoryStorage(); // Configure multer to store files in memory

const upload = multer({ storage: storage }); // Create multer instance with memory storage

class AdminController {
  path = "/admin";
  router = new Router();
  _adminService = new AdminService();

  constructor() {
    this.initializeRoutes(); // Initialize routes on construction
  }

  // Sets up the routes for admin-related endpoints
  initializeRoutes() {
    // Users
    this.router.get(`${this.path}/users`, isAdmin, this.getAllUsers); // Route to get all users
    this.router.delete(`${this.path}/users/:userId`, isAdmin, this.deleteUser); // Route to delete a specific user

    // Items
    this.router.delete(`${this.path}/items/:itemId`, isAdmin, this.deleteItem); // Route to delete a specific item
    this.router.post(
      `${this.path}/items`,
      [
        isAdmin,
        upload.single("image"),
        validationMiddleware(validate.createItem),
      ],
      this.createItem, // Route to create a new item with an image upload
    );

    // Orders
    this.router.delete(
      `${this.path}/orders/:orderId`,
      isAdmin,
      this.cancelOrder, // Route to cancel a specific order
    );
    this.router.get(`${this.path}/orders`, isAdmin, this.getAllOrders); // Route to get all orders
    this.router.patch(
      `${this.path}/orders/:orderId/status`,
      [isAdmin, validationMiddleware(validate.updateOrderStatus)],
      this.updateOrderStatus, // Route to update the status of a specific order
    );

    // Drivers
    this.router.get(`${this.path}/drivers`, isAdmin, this.getAllDrivers); // Route to get all drivers
  }

  // Orders

  /**
   * Retrieves all orders from the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  getAllOrders = async (req, res, next) => {
    try {
      const orders = await this._adminService.getAllOrders(); // Fetch all orders
      res.status(200).json({ orders }); // Respond with orders
    } catch (err) {
      throw new HttpException(403, err.message); // Handle errors and respond with an error
    }
  };

  /**
   * Updates the status of a specific order.
   * @param {Object} req - The request object containing the order ID and new status.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  updateOrderStatus = async (req, res, next) => {
    try {
      const { orderId } = req.params; // Extract order ID from URL parameters
      const { status } = req.body; // Extract new status from request body
      const order = await this._adminService.updateOrderStatus(status, orderId); // Update order status
      res.status(200).json({ order }); // Respond with updated order
    } catch (err) {
      next(new HttpException(400, err.message)); // Handle errors and respond with an error
    }
  };

  /**
   * Cancels a specific order by deleting it.
   * @param {Object} req - The request object containing the order ID.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  cancelOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params; // Extract order ID from URL parameters
      await this._adminService.deleteOrder(orderId); // Delete the order
      res.sendStatus(204); // Respond with no content
    } catch (err) {
      next(new HttpException(400, err.message)); // Handle errors and respond with an error
    }
  };

  // Users

  /**
   * Retrieves all users from the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  getAllUsers = async (req, res, next) => {
    try {
      const users = await this._adminService.getAllUsers(); // Fetch all users
      res.status(200).json({ users }); // Respond with users
    } catch (err) {
      next(new HttpException(400, err.message)); // Handle errors and respond with an error
    }
  };

  /**
   * Deletes a specific user from the database.
   * @param {Object} req - The request object containing the user ID.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.userId; // Extract user ID from URL parameters
      await this._adminService.deleteUser(userId); // Delete the user
      res.status(200).json({
        message: `User with ID ${userId} has been deleted successfully.`, // Respond with success message
      });
    } catch (err) {
      next(new HttpException(404, err.message)); // Handle errors and respond with an error
    }
  };

  // Items

  /**
   * Creates a new item and uploads its image to S3.
   * @param {Object} req - The request object containing item details and image.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  createItem = async (req, res, next) => {
    try {
      const image = req.file; // Extract image from the request file
      const { name, price, preparation_time } = req.body; // Extract item details from request body
      const item = await this._adminService.createItem(
        name,
        price,
        preparation_time,
        image,
      ); // Create the item
      return res.status(201).json({ item }); // Respond with the created item
    } catch (err) {
      next(new HttpException(400, err.message)); // Handle errors and respond with an error
    }
  };

  /**
   * Deletes a specific item from the database.
   * @param {Object} req - The request object containing the item ID.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  deleteItem = async (req, res, next) => {
    try {
      const itemId = req.params.itemId; // Extract item ID from URL parameters
      await this._adminService.deleteItem(itemId); // Delete the item
      res.sendStatus(204); // Respond with no content
    } catch (err) {
      next(new HttpException(404, err.message)); // Handle errors and respond with an error
    }
  };

  // Drivers

  /**
   * Retrieves all drivers from the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  getAllDrivers = async (req, res, next) => {
    try {
      const drivers = await this._adminService.getAllDrivers(); // Fetch all drivers
      res.status(200).json({ drivers }); // Respond with drivers
    } catch (err) {
      next(new HttpException(400, err.message)); // Handle errors and respond with an error
    }
  };
}

export default AdminController;
