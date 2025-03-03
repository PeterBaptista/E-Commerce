import { Router } from "express";
import { attemptCancel } from "../controllers/cancel-order/cancel-order-controllers";
import express from 'express';
import { Request, Response } from "express";
import supabase from "../supabase/supabase";
import { deleteOrderHistory, filterOrdersByDate, getOneOrderHistory, getOrderHistory, postOrderHistory, putOrderHistory } from "../controllers/order-history/order-history-controllers";
//import app from '../server'

export const orderHistoryRouter = Router();
const app = express(); 
const PORT = process.env.PORT || 3000;
const router = express.Router();

orderHistoryRouter.post("/",postOrderHistory);
orderHistoryRouter.put("/", putOrderHistory);
orderHistoryRouter.delete("/",deleteOrderHistory);
orderHistoryRouter.get("/", getOrderHistory, getOneOrderHistory, filterOrdersByDate);









