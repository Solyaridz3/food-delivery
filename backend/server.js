import express from "express";

class App {
    constructor(controllers, port) {
        this.express = express();
        
        this.port = port;
        this.#initializeMiddleware();
        this.#initializeControllers(controllers);
    }
    #initializeMiddleware(){
        this.express.use(express.json());
    }

    #initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use("/api/v2", controller.router);
        });
    }

    listen() {
        this.express.listen(this.port, () => {
            console.log(`App is running on port ${this.port}`);
        });
    }
}

export default App;
