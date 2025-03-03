import type { Request, Response } from "express";
import { fetchProductOrderHistoryByOrderId } from "./utils/product-order-history-utils";
import supabase from "../../supabase/supabase";
import { ProductOrderHistory } from "./schemas/product-order-history-schema";

export const getProductOrderHistory = async (req: Request, res: Response) => {
    try {
      // Obtém o order_id da query string
      const orderId = Number(req.query.order_id);
  
      //problema esta aqui haha
      /*if (!orderId || isNaN(orderId)) {
         res.status(400).json({ message: "Parâmetro 'order_id' inválido" });
      } else {*/
          // Usa a função utilitária para buscar os itens do pedido
        const productOrderHistory = await fetchProductOrderHistoryByOrderId(orderId);
        
        /*if (!productOrderHistory || productOrderHistory.length === 0) {
          res.status(404).json({ message: "Nenhum item encontrado para este pedido." });
        }*/

        // Retorna os dados como JSON
        res.status(200).json(productOrderHistory);
      //}
      
    } catch (error) {
      console.error("Erro inesperado:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

export const postProductOrderHistory = async (req: Request, res: Response) => {
  const POSData: ProductOrderHistory = req.body

  const { error, data } = await supabase
    .from('product-order-history')
    .insert({
      order_id: POSData.order_id,
      product_id: POSData.product_id,
      price_paid: POSData.price_paid,
      amount: POSData.amount,
    })
    .select()

  if (error) res.status(500).json(error)

  res.json(data?.[0] ?? null)
};

export const putProductOrderHistory = async (req: Request, res: Response) => {

  const POSData: ProductOrderHistory = req.body

  const { error, data } = await supabase
    .from('product-order-history')
    .update({
      id: POSData.id,
      order_id: POSData.order_id,
      product_id: POSData.product_id,
      price_paid: POSData.price_paid,
      amount: POSData.amount,
    }).eq('id', POSData.id)
    .select()

  if (error) res.status(500).json(error)

  res.json(data?.[0] ?? null)

};

export const deleteProductOrderHistory = async (req: Request, res: Response) => {
  const POSData: ProductOrderHistory = req.body

  const { error } = await supabase
  .from('product-order-history')
  .delete()
  .eq('id', POSData.id)

  if (error) res.status(500).json(error)

  res.send('Product on POS deleted successfully')
};

  