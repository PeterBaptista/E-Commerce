import { Router } from "express";
import express from 'express';
import { deleteOrderHistory, filterOrdersByDate, getOneOrderHistory, getOrderHistory, postOrderHistory, putOrderHistory } from "../controllers/order-history/order-history-controllers";

export const orderHistoryRouter = Router();
const app = express(); 
const PORT = process.env.PORT || 3000;
const router = express.Router();

orderHistoryRouter.post("/",postOrderHistory);
orderHistoryRouter.put("/", putOrderHistory);
orderHistoryRouter.delete("/",deleteOrderHistory);
orderHistoryRouter.get("/", getOrderHistory, getOneOrderHistory, filterOrdersByDate);









