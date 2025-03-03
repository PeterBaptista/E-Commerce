// /cliente/app/(app)/api/order-api.ts
import { axiosApi } from "@/lib/axios-client";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
  baseURL: BASE_URL, // URL do back-end
});

export const getOrders = async () => {
  try {
    const response = await api.get("/order-history");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os pedidos:", error);
    throw error;
  }
};

/*
sem tratamento de erros
export const getOrderItemsToOrder = async (orderId: number) => {
  const response = await api.get(`/product-order-history?order_id=${orderId}`);
  return response.data;
};
*/

export const getOrderItemsToOrder = async (orderId: number) => {
  try {
    const response = await api.get(`http://localhost:3000/product-order-history?order_id=${orderId}`);
    return response.data; // Retorna os dados brutos da API
  } catch (error) {
    console.error("Error fetching order items:", error);
    throw new Error("Failed to load order items. Please try again later.");
  }
};

export const getOrderItems = async (orderId: string) => {
  const response = await api.get(`http://localhost:3000/product-order-history?order_id=${orderId}`);
  // const response = await axiosApi(`/product-order-history?order_id=${orderId}`);
  console.log(response);
  if (response.status === 500) throw new Error("Erro ao buscar itens");
  return response.data;
};
