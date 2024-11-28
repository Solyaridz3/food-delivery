import { Router } from "express";
import HttpException from "../../utils/exceptions/HttpException.js";
import ItemService from "./service.js";

class ItemController {
  path = "/items";
  router = new Router();
  _itemService = new ItemService();

  constructor() {
    this.initializeRoutes();
  }

  // Sets up the routes for item-related endpoints
  initializeRoutes() {
    this.router.get(`${this.path}/`, this.getAll); // Route to get all items
    this.router.get(`${this.path}/details/:itemId`, this.getItem); // Route to get details of a specific item
    this.router.get(`${this.path}/selection`, this.getSelection); // Route to get a selection of items
  }

  // Retrieves a list of all items
  getAll = async (req, res, next) => {
    try {
      const items = await this._itemService.getAll();
      res.status(200).json({ items });
    } catch (err) {
      next(new HttpException(400, err.message)); // Handles errors and responds with a 400 status
    }
  };

  // Retrieves details of a specific item
  getItem = async (req, res, next) => {
    try {
      const itemId = req.params.itemId;
      const item = await this._itemService.getItem(itemId);
      res.status(200).json({ item });
    } catch (err) {
      next(new HttpException(404, err.message)); // Handles errors and responds with a 404 status
    }
  };

  // Retrieves a selection of items based on provided IDs
  getSelection = async (req, res, next) => {
    try {
      const itemsIds = req.body.items_ids;
      const items = await this._itemService.getSelection(itemsIds);
      res.status(200).json({ items });
    } catch (err) {
      next(new HttpException(400, err.message)); // Handles errors and responds with a 400 status
    }
  };
}

export default ItemController;
