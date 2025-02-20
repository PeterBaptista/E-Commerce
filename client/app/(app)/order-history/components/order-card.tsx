"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrderItemsToOrder } from "../../api/order-api";

interface OrderCardProps {
  order: {
    order_id: number;
    order_data: string;
    destination: string;
    status: string;
    total_value: number | string;
  };
  onViewDetails: (orderId: number) => void;
}

interface OrderItem {
  id: string;
  created_at: string;
  product_id: string;
  price_paid: string;
  amount: number;
  product_name: string;
  image_url: string;
}

const fetchProductDetails = async (productId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/products/${productId}`);
    if (!response.ok) throw new Error("Produto não encontrado");
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return null;
  }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([]);
  const totalValue = typeof order.total_value === "string" ? parseFloat(order.total_value) : order.total_value;

  // Função para carregar os itens do pedido e os detalhes dos produtos
  const loadOrderItems = async () => {
    try {
      // Busca os itens do pedido
      const orderItems = await getOrderItemsToOrder(order.order_id);

      // Busca detalhes dos produtos em paralelo
      const itemsWithDetails = await Promise.all(
        orderItems.map(async (item: any) => {
          const productDetails = await fetchProductDetails(item.product_id);
          return {
            ...item,
            product_name: productDetails?.name || "Produto não disponível",
            image_url: productDetails?.image_url || "https://www.shutterstock.com/image-vector/no-image-available-picture-coming-600nw-2057829641.jpg"
          };
        })
      );

      // Limita a 4 itens para exibição
      setItems(itemsWithDetails.slice(0, 4));
    } catch (err) {
      console.error("Erro ao carregar itens do pedido:", err);
    }
  };

  // Carrega os itens quando o componente é montado
  useEffect(() => {
    loadOrderItems();
  }, []);

  const navigateToOrderDetails = () => {
    router.push(`/product-order-history?order_id=${order.order_id}`);
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        padding: "16px",
        margin: "8px 0",
        borderRadius: "12px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "0.3s",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Detalhes do pedido */}
        <div>
          <h3 style={{ marginBottom: "8px", color: "#333" }}>Pedido #{order.order_id}</h3>
          <p style={{ color: "#666", fontSize: "14px" }}>Data: {order.order_data}</p>
          <p style={{ color: "#666", fontSize: "14px" }}>Destino: {order.destination}</p>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Status:{" "}
            <strong style={{ color: order.status === "Delivered" ? "#28a745" : "#dc3545" }}>
              {order.status}
            </strong>
          </p>
          <p style={{ fontWeight: "bold", fontSize: "16px", color: "#000" }}>
            Valor Total: R$ {totalValue.toFixed(2)}
          </p>
          <button
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              fontSize: "14px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onClick={navigateToOrderDetails}
          >
            Ver Detalhes
          </button>
        </div>

        {/* Imagens dos produtos */}
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          {items.length > 0 ? (
            items.map((item, index) => (
              <img
                key={index}
                src={item.image_url}
                alt={item.product_name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ))
          ) : (
            <img
              src="https://www.shutterstock.com/image-vector/no-image-available-picture-coming-600nw-2057829641.jpg"
              alt="Imagem padrão"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;