import { orderHistoryRouter, } from "../../routes/order-history-routes";
//import { orderHistoryErrorRouter } from "../../routes/order-history-routes";
import supabase from "../../supabase/supabase";
import { Request, Response } from "express";

/**
 * Função para buscar o histórico de pedidos de um usuário específico.
 */
export const getOrderHistory = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    // Consulta ao Supabase para buscar os pedidos do usuário
    const { data, error } = await supabase
      .from("order-history") // Certifique-se de que o nome da tabela está correto
      .select("*")
      .eq("user_id", userId);

    if (error) {
      orderHistoryRouter.get("/error")
    }

    if (!data || data.length === 0) {
      return [];
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

    return formattedOrders;
  } catch (error) {
    console.error("Erro inesperado:", error);
    throw new Error("Erro ao carregar pedidos.");
  }
};


/**
 * Função para filtrar pedidos por data.
 */
export const filterOrdersByDate = async (req: Request, res: Response) => {
  const { date } = req.query;

  if (typeof date !== "string") {
    return res.status(400).json({ message: "Data inválida ou ausente." });
  }

  try {
    // Consulta ao Supabase para filtrar pedidos pela data
    const { data, error } = await supabase
      .from("order-history") // Certifique-se de que o nome da tabela está correto
      .select("*")
      .eq("order_data", date);

    if (error) {
      console.error("Erro ao consultar o Supabase:", error.message);
      throw new Error("Erro ao filtrar pedidos.");
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transforma os dados para o formato esperado nos testes
    const formattedOrders = data.map((order: any) => ({
      order_id: String(order.order_id),
      order_data: order.order_data,
      destination: order.destination,
      status: order.status,
      total_value: String(order.total_value),
    }));

    return formattedOrders;
  } catch (error) {
    console.error("Erro inesperado:", error);
    throw new Error("Erro ao filtrar pedidos.");
  }
};
