import App from "./app.js";
import UserController from "./resources/user/controller.js";
import ItemController from "./resources/item/controller.js";
import OrderController from "./resources/order/controller.js";
import DriverController from "./resources/driver/controller.js";
import AdminController from "./resources/admin/controller.js";

const PORT = 3000;

const controllers = [
    new UserController(),
    new ItemController(),
    new OrderController(),
    new DriverController(),
    new AdminController(),
];

const app = new App(controllers, PORT);

app.listen();
