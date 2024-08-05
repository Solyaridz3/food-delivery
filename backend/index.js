import App from "./app.js";
import UserController from "./resources/user/controller.js";

const PORT = 3000;

const app = new App([new UserController()], PORT);

app.listen();
