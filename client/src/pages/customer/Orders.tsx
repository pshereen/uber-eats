import { useEffect, useState } from 'react';
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

export default function OrdersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`${API_URL}/api/orders?userId=${user._id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, [API_URL, user]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-[#db7e21] flex items-center gap-2">
          📦 My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const groupedItems = order.items.reduce((acc: Record<string, OrderItem[]>, item) => {
                const restaurantName = item.restaurant?.name || 'Unknown';
                if (!acc[restaurantName]) acc[restaurantName] = [];
                acc[restaurantName].push(item);
                return acc;
              }, {});

              return (
                <div key={order._id} className="border rounded-xl shadow-md p-6 bg-white">
                  {/* Header */}
                  <div className="flex justify-between items-start border-b pb-3 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                      <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                    </div>
                    <span className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(groupedItems).map(([restaurant, items]) => (
                      <div key={restaurant}>
                        <h3 className="text-lg font-semibold text-[#db7e21] mb-2">{restaurant}</h3>
                        <div className="space-y-2">
                          {items.map((item) => (
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
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="text-right mt-6 text-lg font-semibold text-green-600">
                    Total: ${order.total.toFixed(2)}
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
