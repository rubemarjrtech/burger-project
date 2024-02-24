import { Router } from "express";
import UserController from "./app/controllers/userController";

const router = new Router();

router.post("/sign-up", UserController.store);

export default router;
