import express from "express";
import router from "./routes.js";
import "dotenv/config";
import "./database/index.js";
import path, { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
