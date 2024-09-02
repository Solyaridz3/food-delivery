import { Router } from "express";
import HttpException from "../../utils/exceptions/HttpException.js";
import ItemService from "./service.js";

class ItemController {
  path = "/items";
  router = new Router();
  #itemService = new ItemService();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}/`, this.getAll);
    this.router.get(`${this.path}/details/:itemId`, this.getItem);
    this.router.get(`${this.path}/selection`, this.getSelection);
  }

  getAll = async (req, res, next) => {
    try {
      const items = await this.#itemService.getAll();
      res.status(200).json({ items });
    } catch (err) {
      next(new HttpException(400, err.message));
    }
  };

  getItem = async (req, res, next) => {
    try {
      const itemId = req.params.itemId;
      const item = await this.#itemService.getItem(itemId);
      res.status(200).json({ item });
    } catch (err) {
      next(new HttpException(404, err.message));
    }
  };

  getSelection = async (req, res, next) => {
    try {
      const itemsIds = req.body.items_ids;
      const items = await this.#itemService.getSelection(itemsIds);
      res.status(200).json({ items });
    } catch (err) {
      next(new HttpException(400, err.message));
    }
  };
}

export default ItemController;
