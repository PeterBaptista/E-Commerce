import { Router } from "express";
import express from 'express';
import { Request, Response } from "express";
import supabase from "../supabase/supabase";
//import app from '../server'

export const orderHistoryRouter = Router();
const app = express(); // Cria a instância do servidor Express
const PORT = process.env.PORT || 3000;
const router = express.Router();


orderHistoryRouter.get("/:", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    
    // Consulta ao Supabase para buscar os pedidos do usuário
    const { data, error } = await supabase
      .from("order-history") // Nome da tabela no Supabase
      .select("*")
       // Filtra pelo ID do usuário

    if (error) {
      console.error("Erro ao consultar o Supabase:", error.message);
      res.status(500).json();
      return; // Usamos `return` apenas para sair da função, mas não para retornar diretamente a resposta
    }

    if (!data || data.length === 0) {
      res.status(404).json();
      return; // Mesma lógica aqui
    }

    // Transforma os dados para o formato esperado nos testes
    const formattedOrders = data.map((order: any) => ({
      order_id: String(order.order_id),
      created_at: order.created_at,
      order_data: order.order_data,
      destination: order.destination,
      status: order.status,
      total_value: String(order.total_value),
    }));

    res.json(formattedOrders); // Envia a resposta diretamente
  } catch (error) {
    console.error("Erro inesperado:", error);
    res.status(500).json({ message: "Erro ao carregar pedidos. Tente novamente mais tarde." });
  }
});


orderHistoryRouter.get("/", async (req: Request, res: Response) => {
  const { date } = req.query;

  try {
    // Consulta ao Supabase para filtrar pedidos pela data
    const { data, error } = await supabase
      .from("order-history") // Nome da tabela no Supabase
      .select("*")
      .order("order_data", { ascending: false }); // Ordena pela coluna 'order_data' de forma decrescente
// Filtra pela data

    if (error) {
      console.error("Erro ao consultar o Supabase:", error.message);
      res.status(500).json({ message: "Erro ao filtrar pedidos. Tente novamente mais tarde." });
      return;
    }

    if (!data || data.length === 0) {
      res.status(404).json({ message: "Nenhum pedido encontrado para a data especificada." });
      return;
    }

    // Transforma os dados para o formato esperado nos testes
    const formattedOrders = data.map((order: any) => ({
      order_id: String(order.order_id),
      order_data: order.order_data,
      destination: order.destination,
      status: order.status,
      total_value: String(order.total_value),
    }));

    res.json(formattedOrders); // Envia a resposta diretamente
  } catch (error) {
    console.error("Erro inesperado:", error);
    res.status(500).json({ message: "Erro ao filtrar pedidos. Tente novamente mais tarde." });
  }
});

const orders = [
  { order_id: "1", created_at: "2025-02-09T18:41:15+00:00", order_data: "2023-10-01", destination: "Rua A, 123", status: "delivered", total_value: "550" },
  { order_id: "2", created_at: "2025-02-09T18:45:48.99775+00:00", order_data: "2023-09-25", destination: "Rua B, 456", status: "shipped", total_value: "200" },
  { order_id: "3", created_at: "2025-02-09T18:46:27.623864+00:00", order_data: "2023-09-20", destination: "Rua C, 789", status: "pending", total_value: "150" },
  { order_id: "4", created_at: "2025-02-09T18:49:36.882636+00:00", order_data: "2023-09-15", destination: "Rua D, 101", status: "canceled", total_value: "300" },
  { order_id: "5", created_at: "2025-02-09T18:53:10.346646+00:00", order_data: "2023-09-10", destination: "Rua E, 202", status: "delivered", total_value: "100" },
];

orderHistoryRouter.get("/orders", (req, res) => {
  res.json(orders);
});





