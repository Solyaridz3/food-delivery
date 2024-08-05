import express from "express";
import { errorMiddleware as ErrorHandler } from "./middleware/index.js";

class App {
    constructor(controllers, port) {
        this.express = express();
        this.port = port;

        this.#initializeMiddleware();
        this.#initializeControllers(controllers);
        this.#initializeErrorHandling();
    }
    #initializeMiddleware() {
        this.express.use(express.json());
    }

    #initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use("/api/v2", controller.router);
        });
    }

    #initializeErrorHandling() {
        this.express.use(ErrorHandler);
    }

    listen() {
        this.express.listen(this.port, () => {
            console.log(`App is running on port ${this.port}`);
        });
    }
}

export default App;
