import { Request, Response } from "express";
import supabase from "../../supabase/supabase";


export async function attemptCancel(req: Request, res: Response) {
    const order_id: number = +req.params.orderId

    const { data, error } = await supabase
      .from('order-history')
      .select("status")
      .eq("order_id",order_id)
      .single();

    if (error) {
        res.status(500).json(error);
    }
    else {
        if (data.status && (data.status == "pending" || data.status == "processing")) {
            const { error } = await supabase 
                .from("order-history")
                .update({"status": "canceled"})
                .eq("order_id",order_id);

            if (error){
                res.status(500).json(error);
            } 
            else{
                const { data: order_products, error } = await supabase
                    .from("product-order-history")
                    .delete()
                    .eq("order_id", order_id)
                    .select(` 
                        amount,
                        products(id, stock_quantity)
                        `);
                    
                    if (error){
                        res.send("Order canceled successfully. No products found on this order");
                    }
                    else{
                        let updated_stock: number;
                        for (const row of order_products) {
                            if(row.products && row.amount){
                                updated_stock = row.products.stock_quantity + row.amount;
                                const {error} = await supabase
                                    .from("products")
                                    .update({stock_quantity: updated_stock})
                                    .eq("id" ,row.products.id);
                                if (error){
                                    res.status(500).json(error);
                                    return;
                                } 
                            }
                        }
                        res.send("Order of id: " + order_id + " has been canceled. The stocks of this order's products have been adjusted");
                    }      
            }
        }
        else{
                res.send("Order couldn't be canceled due to status: " + data.status); 
        }
    }
}