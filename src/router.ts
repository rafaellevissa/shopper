import { Router } from "express";
import ExpenseController from "./consumption/consumption.controller";

const route = Router();

route.post("/upload", ExpenseController.upload);
route.patch("/confirm", ExpenseController.confirm);
route.get("/:customerCode/list", ExpenseController.listByCustomer);

export default route;
