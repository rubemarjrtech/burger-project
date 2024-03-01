import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";
import UserController from "./app/controllers/userController";
import SessionController from "./app/controllers/sessionController";
import ProductController from "./app/controllers/productsController";
import authMiddleware from "./app/middlewares/auth";
import CategoriesController from "./app/controllers/categoriesController";
import orderController from "./app/controllers/orderController";

const upload = multer(multerConfig);
const router = new Router();

router.post("/sign-up", UserController.store);
router.post("/sessions", SessionController.store);

router.use(authMiddleware);
router.post("/products", upload.single("file"), ProductController.store);
router.get("/products", ProductController.index);

router.post("/categories", CategoriesController.store);
router.get("/categories", CategoriesController.index);

router.post("/orders", orderController.store);

export default router;
