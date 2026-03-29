import { Router } from "express";
import { getPayment, postCreatePayment } from "../controller/paymentController.js";

export const paymentRouter = Router();

paymentRouter.post("/payments", postCreatePayment);
paymentRouter.get("/payments/:id", getPayment);
