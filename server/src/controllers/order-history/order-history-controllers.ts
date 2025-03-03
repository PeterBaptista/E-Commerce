import { Request, Response } from "express";
import supabase from "../../supabase/supabase";
import { OrderHistory } from "./schema/order-history-schema";


export const getOneOrderHistory =  async (req: Request, res: Response) => {
  const OSData: OrderHistory = req.body

}

export const postOrderHistory = async (req: Request, res: Response) => {
  const OSData: OrderHistory = req.body

  const { error, data } = await supabase
    .from('order-history')
    .insert({
      order_data: OSData.order_data,
      destination: OSData.destination,
      status: OSData.status,
      total_value: OSData.total_value,
    })
    .select()

  if (error) res.status(500).json(error)

  res.json(data?.[0] ?? null)
}

export const putOrderHistory = async (req: Request, res: Response) => {
  const OSData: OrderHistory = req.body

  const { error, data } = await supabase
    .from('order-history')
    .update({
      order_data: OSData.order_data,
      destination: OSData.destination,
      status: OSData.status,
      total_value: OSData.total_value,
    })
    .eq('order_id', OSData.order_id)
    .select()
    

  if (error) res.status(500).json(error)

  res.json(data?.[0] ?? null)
}

export const deleteOrderHistory = async (req: Request, res: Response) => {
  const OSData: OrderHistory = req.body

  const { error } = await supabase
  .from('order-history')
  .delete()
  .eq('order_id', OSData.order_id)

  if (error) res.status(500).json(error)

  res.send('Order deleted successfully')
}


export const getOrderHistory = async (req: Request, res: Response) => {
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
};

/**
 * Função para filtrar pedidos por data.
 */
export const filterOrdersByDate = async (req: Request, res: Response) => {
  const { date } = req.query;

  if (typeof date !== "string" || !date) {
    res.status(400).json({ message: "Data inválida ou ausente." });
  } else {
    try {
      // Consulta ao Supabase para filtrar pedidos pela data
      const { data, error } = await supabase
        .from("order-history")
        .select("*")
        .eq("order_data", date);

      if (error) {
        console.error("Erro ao consultar o Supabase:", error.message);
        res.status(500).json({ message: "Erro ao filtrar pedidos." });
      } else if (!data || data.length === 0) {
        res
          .status(404)
          .json({ message: "Nenhum pedido encontrado para a data informada." });
      } else {
        // Transforma os dados para o formato esperado nos testes
        const formattedOrders = data.map((order: any) => ({
          order_id: String(order.order_id),
          order_data: order.order_data,
          destination: order.destination,
          status: order.status,
          total_value: String(order.total_value),
        }));
        res.status(200).json(formattedOrders);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      res.status(500).json({ message: "Erro ao filtrar pedidos." });
    }
  }
};