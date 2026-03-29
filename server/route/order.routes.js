import { Router } from "express";
import auth from "../middleware/auth.js";
//import { getOrderDetailsController } from "../controller/order.controller.js";
import { createOrderController, getOrderDetailsController } from "../controller/order.controller.js";
const orderRouter = Router();
orderRouter.post("/create", auth, createOrderController);
orderRouter.get("/get", auth, getOrderDetailsController);

export default orderRouter;
