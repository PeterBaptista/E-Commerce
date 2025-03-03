// // Arquivo: /product-order-history/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import ProductOrderCard from "./components/product-order-card";
import { useSearchParams, useRouter } from "next/navigation";
import { axiosApi } from "@/lib/axios-client";

interface OrderItem {
  id: string;
  created_at: string;
  product_id: string;
  price_paid: string;
  amount: number;
  product_name: string;
  image_url: string;
}

const ProductOrderHistoryPage = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const defaultImage = "https://www.shutterstock.com/image-vector/no-image-available-picture-coming-600nw-2057829641.jpg";

  const fetchOrderItems = async (orderId: number) => {
    try {
      // Busca direta dos itens do pedido
      const response = await axiosApi.get(
        `http://localhost:3000/product-order-history?order_id=${orderId}`
      );
      
      const orderItems = response.data;

      // Busca detalhes dos produtos em paralelo
      const itemsWithDetails = await Promise.all(
        orderItems.map(async (item: any) => {
          try {
            const productResponse = await axiosApi.get(
              `http://localhost:3000/products/${item.product_id}`
            );
            
            return {
              ...item,
              product_name: productResponse.data.name || "Produto não disponível",
              image_url: productResponse.data.image_url || defaultImage,
            };
          } catch (error) {
            return {
              ...item,
              product_name: "Produto não disponível",
              image_url: defaultImage,
            };
          }
        })
      );

      setItems(itemsWithDetails);
    } catch (err) {
      setError("Erro ao carregar detalhes do pedido");
    }
  };

  useEffect(() => {
    if (order_id && !isNaN(Number(order_id))) {
      fetchOrderItems(Number(order_id));
    }
  }, [order_id]);

  if (!order_id || isNaN(Number(order_id))) {
    return <p>ID do pedido inválido</p>;
  }

  return (
    <div>
      {/* Cabeçalho mantido igual */}
      <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
          onClick={() => router.push("/home")}
        >
          Main Menu
        </button>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition duration-300"
          onClick={() => router.push("/cart")}
        >
          Shopping Cart
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="p-4">
        <button
          className="mb-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
          onClick={() => router.push("/order-history")}
        >
          Back
        </button>

        <h1 className="text-2xl font-bold text-center mb-4">
          Itens by Order #{order_id}
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid gap-4">
          {items.length > 0 ? (
            items.map((item) => (
              <ProductOrderCard
                key={item.id}
                id={item.id}
                createdAt={item.created_at}
                productId={item.product_id}
                pricePaid={item.price_paid}
                amount={item.amount}
                productName={item.product_name}
                imageUrl={item.image_url}
              />
            ))
          ) : (
            <p className="text-gray-600 text-center">
              Nenhum item encontrado neste pedido
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOrderHistoryPage;