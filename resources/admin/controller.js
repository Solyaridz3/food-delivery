import { response, Router } from "express";
import AdminService from "./service.js";
import { isAdmin } from "../../middleware/auth.middleware.js";
import HttpException from "../../utils/exceptions/HttpException.js";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

class AdminController {
  path = "/admin";
  router = new Router();
  _adminService = new AdminService();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Users
    this.router.get(`${this.path}/users`, isAdmin, this.getAllUsers);
    this.router.delete(`${this.path}/users/:userId`, isAdmin, this.deleteUser);

    // Items
    this.router.delete(`${this.path}/items/:itemId`, isAdmin, this.deleteItem);
    this.router.post(
      `${this.path}/items`,
      [isAdmin, upload.single("image")],
      this.createItem,
    );
    // Orders
    this.router.delete(
      `${this.path}/orders/:orderId`,
      isAdmin,
      this.cancelOrder,
    );
    this.router.get(`${this.path}/orders`, isAdmin, this.getAllOrders);
    this.router.patch(
      `${this.path}/orders/:orderId/status`,
      isAdmin,
      this.updateOrderStatus,
    );

    // Drivers
    this.router.get(`${this.path}/drivers`, isAdmin, this.getAllDrivers);
  }
  // Orders

  getAllOrders = async (req, res, next) => {
    try {
      const orders = await this._adminService.getAllOrders();
      res.status(200).json({ orders });
    } catch (err) {
      throw new HttpException(403, err.message);
    }
  };

  updateOrderStatus = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const order = await this._adminService.updateOrderStatus(status, orderId);
      res.status(200).json({ order });
    } catch (err) {
      next(new HttpException(400, err.message));
    }
  };

  cancelOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      await this._adminService.deleteOrder(orderId);
      res.sendStatus(204);
    } catch (err) {
      next(new HttpException(400, err.message));
    }
  };

  // Users

  getAllUsers = async (req, res, next) => {
    try {
      const users = await this._adminService.getAllUsers();
      res.status(200).json({ users });
    } catch (err) {
      next(new HttpException(400, err.message));
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      await this._adminService.deleteUser(userId);
      res.status(200).json({
        message: `User with ID ${userId} has been deleted successfully.`,
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
      const item = await this._adminService.createItem(
        name,
        price,
        preparation_time,
        image,
      );
      return res.status(201).json({ item });
    } catch (err) {
      next(new HttpException(400, err.message));
    }
  };

  deleteItem = async (req, res, next) => {
    try {
      const itemId = req.params.itemId;
      await this._adminService.deleteItem(itemId);
      res.sendStatus(204);
    } catch (err) {
      next(new HttpException(404, err.message));
    }
  };

  // Drivers

  getAllDrivers = async (req, res, next) => {
    try {
      const drivers = await this._adminService.getAllDrivers();
      res.status(200).json({ drivers });
    } catch (err) {
      next(new HttpException(400, err.message));
    }
  };
}

export default AdminController;
