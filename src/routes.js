import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer.js";
import UserController from "./app/controllers/userController.js";
import SessionController from "./app/controllers/sessionController.js";
import ProductController from "./app/controllers/productsController.js";
import authMiddleware from "./app/middlewares/auth.js";
import CategoriesController from "./app/controllers/categoriesController.js";
import OrderController from "./app/controllers/orderController.js";
import adminAuth from "./app/middlewares/admin-auth.js";

const upload = multer(multerConfig);
const router = new Router();

router.get("/", (_, response) =>
    response.json({ message: "Welcome to code burger API" })
);

router.post("/users", UserController.store);
router.post("/sessions", SessionController.store);
router.get("/users", adminAuth, UserController.index);
router.delete("/users", adminAuth, UserController.remove);

router.use(authMiddleware);
router.post("/products", upload.single("file"), ProductController.store);
router.get("/products", ProductController.index);
router.get("/products/:id", ProductController.findOne);
router.put("/products/:id", upload.single("file"), ProductController.update);
router.delete("/products/:id", ProductController.remove);

router.post("/categories", upload.single("file"), CategoriesController.store);
router.get("/categories", CategoriesController.index);
router.get("/categories/:id", CategoriesController.findOne);
router.put(
    "/categories/:id",
    upload.single("file"),
    CategoriesController.update
);
router.delete("/categories/:id", CategoriesController.remove);

router.post("/orders", OrderController.store);
router.get("/orders", OrderController.index);
router.get("/orders/:id", OrderController.findOne);
router.put("/orders/:id", OrderController.update);
router.delete("/orders/:id", OrderController.remove);

export default router;
