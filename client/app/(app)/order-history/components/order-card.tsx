"use client";
import { axiosApi } from "@/lib/axios-client";
import { useRouter } from "next/navigation";
import React from "react";
import { useQuery } from "@tanstack/react-query";

interface Order {
  order_id: number;
  order_data: string;
  destination: string;
  status: string;
  total_value: number | string;
}

interface OrderItem {
  id: string;
  product_id: string;
  price_paid: string;
  amount: number;
  product_name: string;
  image_url: string;
}

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: number) => void;
}

const DEFAULT_IMAGE = "https://www.shutterstock.com/image-vector/no-image-available-picture-coming-600nw-2057829641.jpg";

const useOrderItems = (orderId: number) => {
  return useQuery<OrderItem[]>({
    queryKey: ["orderItems", orderId],
    queryFn: async () => {
      try {
        const { data: orderItems } = await axiosApi.get(`/product-order-history?order_id=${orderId}`);
        if (!Array.isArray(orderItems)) return [];

        const completeItems = await Promise.all(
          orderItems.map(async (item: OrderItem) => {
            try {
              const { data: product } = await axiosApi.get(`/products/${item.product_id}`);
              return { ...item, product_name: product.name, image_url: product.image_url };
            } catch {
              return { ...item, product_name: "Produto não disponível", image_url: DEFAULT_IMAGE };
            }
          })
        );

        return completeItems.slice(0, 4);
      } catch {
        return [];
      }
    },
  });
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const router = useRouter();
  const { data: items, isLoading, isError } = useOrderItems(order.order_id);

  return (
    <div className="border border-300 p-4 m-2 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out cursor-pointer">
      <div className="flex justify-between">
        <div>
          <h3 className="mb-2 text-lg font-medium text-800">Order #{order.order_id}</h3>
          <div className="flex items-center mb-1 text-sm text-600">
            <p className="mr-2">Order placed: {order.order_data}</p>
            <p>Destination: {order.destination}</p>
          </div>
          <p className="mb-2 text-sm text-600">
            Status: <strong className={`font-bold ${order.status === "delivered" ? "text-green-600" : "text-red-600"}`}>{order.status}</strong>
          </p>
          <p className="mb-2 text-base font-bold">Total Value: $ {parseFloat(order.total_value.toString()).toFixed(2)}</p>
          <button
            className="mt-1 px-3 py-1 text-sm font-medium bg-secondary rounded-md hover:bg-primary hover:text-black transition duration-300 ease-in-out"
            onClick={() => router.push(`/product-order-history/${order.order_id}`)}
          >
            See details
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {isLoading || isError || !items || items.length === 0 ? (
            <img src={DEFAULT_IMAGE} alt="Default image" className="w-20 h-20 object-cover rounded-md col-span-2 mx-auto" />
          ) : (
            items.map((item, index) => (
              <img key={index} src={item.image_url} alt={item.product_name} className="w-20 h-20 object-cover rounded-md mx-auto" />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
