"use client"; // Add this line at the very top of the file

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  order_id: number;
  created_at: string;
  order_data: string;
  destination: string;
  status: string;
  total_value: number;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar os pedidos do backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>("/api/order-history");
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar os pedidos. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  // Carrega os pedidos quando o componente é montado
  useEffect(() => {
    fetchOrders();
  }, []);

  // Renderiza o estado de carregamento
  if (loading) {
    return <div>Carregando pedidos...</div>;
  }

  // Renderiza uma mensagem de erro, se houver
  if (error) {
    return <div>{error}</div>;
  }

  // Renderiza os pedidos
  return (
    <div>
      <h1>Histórico de Pedidos</h1>
      {orders.length === 0 ? (
        <p>Você ainda não realizou nenhum pedido.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID do Pedido</th>
              <th>Data do Pedido</th>
              <th>Local de Envio</th>
              <th>Status</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.order_data}</td>
                <td>{order.destination}</td>
                <td>{order.status}</td>
                <td>R$ {order.total_value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;