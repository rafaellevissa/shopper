import { Router } from "express";
import ExpenseController from "./consumption/consumption.controller";

const route = Router();

route.post("/upload", ExpenseController.upload);

export default route;
