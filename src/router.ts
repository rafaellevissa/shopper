import { Router } from "express";
import ExpenseController from "./consumption/consumption.controller";

const route = Router();

route.post("/upload", ExpenseController.upload);
route.patch("/confirm", ExpenseController.confirm);

export default route;
