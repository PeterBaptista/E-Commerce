// // "use client";

// // import React, { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { getOrders, getOrderItemsToOrder } from "./../api/order-api";
// // import OrderCard from "./components/order-card";

// // const OrderHistoryPage = () => {
// //   const [orders, setOrders] = useState<any[]>([]);
// //   const [recentOrders, setRecentOrders] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const router = useRouter();

// //   useEffect(() => {
// //     const fetchOrders = async () => {
// //       try {
// //         const data = await getOrders();
// //         setOrders(data);
// //         setRecentOrders(data.slice(0, 3));
// //       } catch (err) {
// //         setError("Error loading orders.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchOrders();
// //   }, []);

// //   const handleViewOrderDetails = async (orderId: number) => {
// //     try {
// //       const items = await getOrderItemsToOrder(orderId);
// //       alert(JSON.stringify(items, null, 2));
// //     } catch (err) {
// //       setError("Error loading order details.");
// //     }
// //   };
  

// //   if (loading) return <p>Loading...</p>;
// //   if (error) return <p>{error}</p>;

// //   return (
// //     <div>
// //       {/* Top Bar */}
// //       <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
// //         <button
// //           className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300"
// //           onClick={() => router.push("/home")}
// //         >
// //           Main Menu
// //         </button>
// //         <button
// //           className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300"
// //           onClick={() => router.push("/cart")}
// //         >
// //           Shopping Cart
// //         </button>
// //       </div>

// //       {/* Order History */}
// //       <div className="p-4">
// //         <h1 className="text-2xl font-bold text-center mb-4">Order History</h1>
// //         <h2 className="text-xl font-semibold text-center mb-2">Last Orders</h2>
// //         {recentOrders.map((order) => (
// //           <OrderCard key={order.order_id} order={order} onViewDetails={handleViewOrderDetails} />
// //         ))}
// //         <button
// //           className="mt-4 px-6 py-3 text-lg font-medium text-white bg-green-600 rounded hover:bg-green-700 transition duration-300 block mx-auto w-full max-w-[200px]"
// //           onClick={() => setRecentOrders(orders)}
// //         >
// //           View All Orders
// //         </button>
// //         {orders.length === 0 && (
// //           <p className="text-center text-gray-600 mt-4">You haven't placed any orders yet.</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default OrderHistoryPage;

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderCard from "./components/order-card";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Order {
  order_id: number;
  order_data: string;
  destination: string;
  status: string;
  total_value: number | string;
}

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      // const response = await axiosApi('/order-history');
      // const response = await axios.get("http://localhost:3000/order-history");
      // const response = await axios.get("https://e-commerce-api-fnhq.onrender.com/order-history");
      const response = await axios.get("https://e-commerce-api-fnhq.onrender.com/order-history");
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setOrders(data);
      setRecentOrders(data.slice(0, 3));
    }
  }, [data]);

  const handleViewOrderDetails = async (orderId: number) => {
    try {
      //const response = await axiosApi(`/product-order-history?order_id=${orderId}`);
      // const response = await axios.get(
      //   `http://localhost:3000/product-order-history?order_id=${orderId}`
      // );
      const response = await axios.get(
        `https://e-commerce-api-fnhq.onrender.com/product-order-history?order_id=${orderId}`
      );
      // Aqui você pode manipular os detalhes do pedido se necessário
    } catch (err) {
      console.error("Error loading order details.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError)
    return <p>{error instanceof Error ? error.message : "Error loading orders."}</p>;

  return (
    <div className="container">
      {/* Order History */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Order History</h1>
        <h2 className="text-xl font-semibold text-center mb-2">Last Orders</h2>
        {Array.isArray(recentOrders) && recentOrders.length > 0 ? (
          recentOrders.map((order) =>
            order?.order_id ? (
              <OrderCard
                key={order.order_id}
                order={order}
                onViewDetails={handleViewOrderDetails}
              />
            ) : null
          )
        ) : (
          <p className="text-center text-gray-600 mt-4">No recent orders available.</p>
        )}
        <button
          className="mt-4 px-6 py-3 text-lg font-medium text-white bg-green-600 rounded hover:bg-green-700 transition duration-300 block mx-auto w-full max-w-[200px]"
          onClick={() => setRecentOrders(orders)}
        >
          View All Orders
        </button>
        {orders.length === 0 && (
          <p className="text-center text-gray-600 mt-4">
            You haven't placed any orders yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
