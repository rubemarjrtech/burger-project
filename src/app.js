import express from "express";
import router from "./routes";
import "dotenv/config";
import "./database";
import { resolve } from "path";
class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(
            "/product-file",
            express.static(resolve(__dirname, "..", "uploads"))
        );
        this.app.use(
            "/category-file",
            express.static(resolve(__dirname, "..", "uploads"))
        );
    }

    routes() {
        this.app.use("/api", router);
    }
}

export default new App().app;
