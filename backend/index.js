import App from "./server.js";
import UserController from "./user/controller.js";

const PORT = 3000;

const app = new App([new UserController()], PORT);

app.listen();
