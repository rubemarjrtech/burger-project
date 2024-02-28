import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";
import UserController from "./app/controllers/userController";
import SessionController from "./app/controllers/sessionController";
import ProductController from "./app/controllers/productsController";

const upload = multer(multerConfig);
const router = new Router();

router.post("/sign-up", UserController.store);
router.post("/sessions", SessionController.store);
router.post("/products", upload.single("file"), ProductController.store);
router.get("/products", ProductController.index);

export default router;
