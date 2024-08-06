import App from "./app.js";
import UserController from "./resources/user/controller.js";

import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

const PORT = 3000;

const app = new App([new UserController()], PORT);

app.listen();
