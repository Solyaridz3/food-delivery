import express from "express";
import { errorMiddleware as ErrorHandler } from "./middleware/error.middleware.js";
import { testConnection } from "./db.js";
import cors from "cors";

// Main application class
class App {
  // Initializes the app with provided controllers and port
  // @param {Array} controllers - Array of controller instances
  // @param {number} port - Port number on which the server will run
  constructor(controllers, port) {
    this.express = express();
    this.port = port;

    this.#initializeDataBaseConnection();
    this.#initializeMiddleware();
    this.#initializeControllers(controllers);
    this.#initializeErrorHandling();
  }

  // Establishes a database connection
  #initializeDataBaseConnection() {
    testConnection();
  }

  // Sets up middleware for the app
  #initializeMiddleware() {
    this.express.use(express.json());
    this.express.use(cors({ origin: "http://localhost:5173" }));
  }

  // Registers the controllers with the app
  // @param {Array} controllers - Array of controller instances
  #initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.express.use("/api/v2", controller.router);
    });
  }

  // Sets up error handling middleware
  #initializeErrorHandling() {
    this.express.use(ErrorHandler);
  }

  // Starts the server and listens on the specified port
  listen() {
    this.express.listen(this.port, () => {
      console.log(`App is running on port ${this.port}`);
    });
  }
}

export default App;
