import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeFromCart, updateQuantity } from '../../redux/cartSlice';
import DashboardLayout from '../../components/DashboardLayout.bak';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../../redux/cartSlice';

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state: RootState) => state.cart.items);
  const API_URL = import.meta.env.VITE_API_URL;

  const grouped = items.reduce((acc: Record<string, typeof items>, item) => {
    const restaurantName = item.restaurant?.name || 'Unknown Restaurant';
    if (!acc[restaurantName]) acc[restaurantName] = [];
    acc[restaurantName].push(item);
    return acc;
  }, {});

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const user = useSelector((state: RootState) => state.auth.user);

  const toggleSection = (restaurantName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [restaurantName]: !prev[restaurantName],
    }));
  };


  const handleCheckout = async () => {
    try {
      if (!user?._id) {
        alert("User not logged in");
        return;
      }
  
      await axios.post(`${API_URL}/api/orders`, {
        userId: user._id,
        items: items.map((i) => ({
          menuItemId: i._id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          restaurant: i.restaurant,
          image: i.image,
        })),
        total,
      });
  
      dispatch(clearCart());
      navigate('/customer/orders');
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to place order. Please try again.');
    }
  };
  
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-[#db7e21]">🛒 Shopping Cart</h1>

        {items.length === 0 ? (
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([restaurant, items]) => (
              <div key={restaurant} className="border rounded shadow">
                <div
                  onClick={() => toggleSection(restaurant)}
                  className="flex justify-between items-center p-4 cursor-pointer bg-orange-100 hover:bg-orange-200"
                >
                  <h2 className="text-lg font-semibold">{restaurant}</h2>
                  {openSections[restaurant] ? <ChevronUp /> : <ChevronDown />}
                </div>
                {openSections[restaurant] && (
                  <div className="space-y-4 p-4 bg-white">
                    {items.map((item) => (
                      <div key={item._id} className="flex gap-4 items-center border-b pb-4">
                        {item.image && (
                          <img
                            src={`${API_URL}${item.image}`}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-sm">💲{item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) =>
                                dispatch(updateQuantity({ id: item._id, quantity: +e.target.value }))
                              }
                              className="w-16 px-2 py-1 border rounded"
                            />
                            <button
                              onClick={() => dispatch(removeFromCart(item._id))}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate('/customer/browse')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded"
          >
            ← Continue Shopping
          </button>

          {items.length > 0 && (
            <div className="text-right">
              <p className="text-lg font-bold mb-2">
                Total: <span className="text-green-600">${total.toFixed(2)}</span>
              </p>
              <button
                onClick={handleCheckout}
                className="bg-[#db7e21] hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded"
              >
                Checkout →
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
