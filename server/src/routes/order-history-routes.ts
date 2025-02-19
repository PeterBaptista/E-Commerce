import { Router } from "express";
import { attemptCancel } from "../controllers/cancel-order/cancel-order-controllers";
import express from 'express';
import { Request, Response } from "express";
import supabase from "../supabase/supabase";
//import app from '../server'

export const orderHistoryRouter = Router();
const app = express(); 
const PORT = process.env.PORT || 3000;
const router = express.Router();


orderHistoryRouter.get("/:", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    
    const { data, error } = await supabase
      .from("order-history") 
      .select("*")
       

    if (error) {
      console.error("Erro ao consultar o Supabase:", error.message);
      res.status(500).json();
      return; 
    }

    if (!data || data.length === 0) {
      res.status(404).json();
      return; 
    }

    
    const formattedOrders = data.map((order: any) => ({
      order_id: String(order.order_id),
      created_at: order.created_at,
      order_data: order.order_data,
      destination: order.destination,
      status: order.status,
      total_value: String(order.total_value),
    }));

    res.json(formattedOrders); 
  } catch (error) {
    console.error("Erro inesperado:", error);
    res.status(500).json({ message: "Erro ao carregar pedidos. Tente novamente mais tarde." });
  }
});


orderHistoryRouter.get("/", async (req: Request, res: Response) => {
  const { date } = req.query;

  try {
    
    const { data, error } = await supabase
      .from("order-history") 
      .select("*")
      .order("order_data", { ascending: false }); 

    if (error) {
      console.error("Erro ao consultar o Supabase:", error.message);
      res.status(500).json({ message: "Erro ao filtrar pedidos. Tente novamente mais tarde." });
      return;
    }

    if (!data || data.length === 0) {
      res.status(404).json({ message: "Nenhum pedido encontrado para a data especificada." });
      return;
    }

    
    const formattedOrders = data.map((order: any) => ({
      order_id: String(order.order_id),
      order_data: order.order_data,
      destination: order.destination,
      status: order.status,
      total_value: String(order.total_value),
    }));

    res.json(formattedOrders); 
  } catch (error) {
    console.error("Erro inesperado:", error);
    res.status(500).json({ message: "Erro ao filtrar pedidos. Tente novamente mais tarde." });
  }
});







