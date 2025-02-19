import { Request, Response } from "express";
import supabase from "../../supabase/supabase";

export async function getAllCart(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('shopping-cart')
      .select(`
        products(id, name, price, image_url, stock_quantity, is_active),
        amount
      `)

    if (error) {
      res.status(500).json(error);
    }
    else {
    res.json(data);
    }
}

export async function getCartProduct(req: Request, res: Response) {
    const id: string = req.params.productId;
    const { data, error } = await supabase
      .from("shopping-cart")
      .select(`
        products(id, name, description, price, image_url, stock_quantity, is_active),
        amount
      `)
      .eq("id",id); 

    if (error) {
      res.status(400).json(error);
    }
    else {
    res.json(data);
    }
}

export async function addToCart(req: Request, res: Response) {
    const product_id: string = req.body.product_id;

    const { error, data } = await supabase
        .from("shopping-cart")
        .insert(req.body)
        .select(`
          products(name)
        `)
        .single();
    
    if (error) {
        res.status(400).json(error);
    }
    else {
    res.send("Product "+ data.products.name +" successfully added to cart");
    }
};
  

export async function deleteFromCart(req: Request, res: Response) {
    const id: string = req.params.productId;
    const { data, error } = await supabase
        .from('shopping-cart')
        .delete()
        .eq('id', id)
        .select(`
          products(name)
        `)
        .single();  
    if (error) {
      res.status(500).json(error)
    }
    else { 
      res.send("Product "+ data.products.name +" removed from shopping cart successfully");
    }
}
  
export async function emptyShoppingCart(req: Request, res: Response) {    
    const { error } = await supabase
        .from('shopping-cart')
        .delete()
        .neq("amount",-1);
    
    if (error) {
      res.status(500).json(error);
    }
    else {
      if (req.path == "/checkout"){
        res.send("Shopping cart successfully checked out. Shopping cart is now empty");
      } 
      else{
        res.send("Shopping cart emptied successfully");
      }

    }
}

export async function updateCartProduct(req: Request, res: Response) {
    const id: string = req.body.id;

    const { data, error } = await supabase
      .from("shopping-cart")
      .update(req.body)
      .eq("id", id)
      .select(`
        products(name)
      `)
      .single();

    if (error) {
      res.status(400).json(error);
    }
    else {
      res.send("Product "+ data.products.name +" updated successfully");

    }
}

export async function checkoutCart(req: Request, res: Response) {
  const { data: cart_products, error } = await supabase
    .from("shopping-cart")
    .select(`
      products(*),
      amount
    `);

  if (error) {
    res.status(500).json(error);
  }
  else {
    for (const row of cart_products) {
        if(row.products.stock_quantity < row.amount){
          res.send("Failed to complete checkout, there are more units of " + row.products.name + " on cart than on stock");
          return;
        }
    };
    let updated_stock: number;
    let price_paid_product: number;
    let total_cost_order: number = 0;
    const {data: new_order, error} = await supabase
      .from("order-history")
      .insert({status: "processing"})
      .select()
      .single()
    
    if (error){
      res.status(500).json(error);
    }
    else {
      for (const row of cart_products) {
        price_paid_product = row.products.price * row.amount;
        total_cost_order += price_paid_product;
        updated_stock = row.products.stock_quantity - row.amount;

        const {error: update_error} = await supabase
          .from("products")
          .update({stock_quantity: updated_stock})
          .eq("id" ,row.products.id)

        const {error: product_error} = await supabase
          .from("product-order-history")
          .insert({
            product_id: row.products.id,
            amount: row.amount, 
            price_paid: price_paid_product, 
            order_id: new_order.order_id})
        if (product_error || update_error){
          res.status(500).json(product_error);
          return;
        }
      };
      const { error } = await supabase
        .from("order-history")
        .update({total_value:total_cost_order})
        .eq("order_id", new_order.order_id)      
      if ( error ) {
        res.status(500).json(error);
      }
      else {
        emptyShoppingCart(req, res);
    }
    }
  }
}
