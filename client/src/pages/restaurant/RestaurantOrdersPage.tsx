import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout.bak';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface OrderItem {
  menuItemId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  restaurant: {
    _id: string;
    name: string;
  };
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export default function RestaurantOrdersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`${API_URL}/api/orders/restaurant/${user._id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching restaurant orders:', err);
      }
    };

    fetchOrders();
  }, [API_URL, user?._id]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-[#db7e21]">🍽️ Restaurant Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No customer orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const filteredItems = order.items.filter(
                (item) => item.restaurant._id === user._id
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={order._id} className="border rounded-xl shadow-md p-6 bg-white">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Order from Customer</h2>
                      <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {filteredItems.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                      >
                        <div className="flex items-center gap-4">
                          {item.image && (
                            <img
                              src={`${API_URL}${item.image}`}
                              alt={item.title}
                              className="w-14 h-14 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{item.title}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="text-right mt-6 text-lg font-semibold text-green-600">
                    Total: $
                    {filteredItems
                      .reduce((acc, item) => acc + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
