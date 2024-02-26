import { Router } from "express";
import UserController from "./app/controllers/userController";
import SessionController from "./app/controllers/sessionController";

const router = new Router();

router.post("/sign-up", UserController.store);
router.post("/sessions", SessionController.store);

export default router;
