"use client";

import React from "react";
import { useRouter } from "next/navigation";
import OrderCard from "./components/order-card";
import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "@/lib/axios-client";

interface Order {
  order_id: number;
  order_data: string;
  destination: string;
  status: string;
  total_value: number | string;
}

const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axiosApi.get(`/order-history`);
      return response.data;
    },
  });
};

const OrderHistoryPage = () => {
  const router = useRouter();
  const { data: orders = [], isLoading, isError, error } = useOrders();
  const [showAll, setShowAll] = React.useState(false);
  const displayedOrders = showAll ? orders : orders.slice(0, 3);

  const handleViewOrderDetails = (orderId: number) => {
    router.push(`/product-order-history/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-4 border-gray border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return <p>{error instanceof Error ? error.message : "Error loading orders."}</p>;
  }

  return (
    <div className="container">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Order History</h1>
        <h2 className="text-xl font-semibold text-center mb-2">Last Orders</h2>
        {displayedOrders.length > 0 ? (
          displayedOrders.map((order) => (
            <OrderCard key={order.order_id} order={order} onViewDetails={handleViewOrderDetails} />
          ))
        ) : (
          <p className="text-center text-gray-600 mt-4">No recent orders available.</p>
        )}
        {!showAll && orders.length > 3 && (
          <button
            className="border border-300 mt-4 px-6 py-3 text-lg font-medium text-black bg-primary rounded hover:bg-secondary hover:text-white transition duration-300 block mx-auto w-full max-w-[200px]"
            onClick={() => setShowAll(true)}
          >
            View All Orders
          </button>
        )}
        {orders.length === 0 && (
          <p className="text-center text-gray-600 mt-4">You haven't placed any orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
