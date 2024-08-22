import App from "./app.js";
import UserController from "./resources/user/controller.js";
import ItemController from "./resources/item/controller.js";
import OrderController from "./resources/order/controller.js";
import getDistance from "./utils/location.js";

import dotenv from "dotenv";

dotenv.config();


getDistance('Viacheslava Chornovola St, 24, Kyiv, 01135').then(console.log);

const PORT = 3000;

const app = new App([new UserController(), new ItemController(), new OrderController()], PORT);

app.listen();
