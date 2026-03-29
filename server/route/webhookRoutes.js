import express, { Router } from "express";
import { postCassoWebhook } from "../controller/cassoWebhookContrlloer.js";

export const webhookRouter = Router();

webhookRouter.post("/casso", express.raw({ type: "application/json" }), postCassoWebhook);
