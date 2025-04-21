import { useEffect, useState } from 'react';
import axios from 'axios';
import { RestaurantUser } from '../../types/UserTypes';
import { MenuItem } from '../../types/MenuItem';
import DashboardLayout from '../../components/DashboardLayout';
import MenuModal from '../../components/customer/MenuModal';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';



export default function BrowseRestaurants() {
  const [restaurants, setRestaurants] = useState<RestaurantUser[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<RestaurantUser[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantUser | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get<RestaurantUser[]>(`${API_URL}/api/restaurants`);
        setRestaurants(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      }
    };

    fetchRestaurants();
  }, [API_URL]);

  useEffect(() => {
    const term = search.toLowerCase();
    const result = restaurants.filter((r) =>
      r.name.toLowerCase().includes(term) || r.location?.toLowerCase().includes(term)
    );
    setFiltered(result);
  }, [search, restaurants]);

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    if (!selectedRestaurant) return;
  
    dispatch(
      addToCart({
        ...item,
        quantity,
        restaurant: {
          _id: selectedRestaurant._id,
          name: selectedRestaurant.name,
        },
      })
    );
  
    setAddedItemName(item.title); 
    setModalOpen(false);          
    setShowCartModal(true);       
  };
  

  const handleRestaurantClick = async (restaurant: RestaurantUser) => {
    try {
      const res = await axios.get(`${API_URL}/api/menu?restaurant=${restaurant._id}`);
      setSelectedRestaurant(restaurant);
      setMenuItems(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch menu items:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-[#db7e21]">🍽️ Browse Restaurants</h1>

        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md mb-6 p-2 border rounded shadow-sm"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((rest) => (
              <div
                key={rest._id}
                onClick={() => handleRestaurantClick(rest)}
                className="cursor-pointer border rounded-lg shadow p-4 bg-white hover:shadow-md transition"
              >
                {rest.image && (
                  <img
                    src={`${API_URL}${rest.image}`}
                    alt={rest.name}
                    className="h-40 w-full object-cover rounded mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-800">{rest.name}</h2>
                <p className="text-gray-600">{rest.location}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No restaurants found.</p>
          )}
        </div>
      </div>

      <MenuModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        restaurantName={selectedRestaurant?.name || ''}
        menu={menuItems} 
        onOrder={handleAddToCart}
      />

    {showCartModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 relative">
          <button
            onClick={() => setShowCartModal(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          >
            &times;
          </button>

          <h2 className="text-xl font-bold mb-4 text-[#db7e21]">Added to Cart</h2>
          <p className="mb-6 font-medium">
            <span className="font-semibold">{addedItemName}</span> has been added to your cart.
          </p>

          <div className="flex justify-between gap-4">
            <button
              onClick={() => {
                setShowCartModal(false);
                navigate('/customer/browse') 
              }}
              className="flex-1 border-2 border-black py-2 rounded-full font-semibold hover:bg-gray-100"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => {
                setShowCartModal(false);
                navigate('/cart') 
              }}
              className="flex-1 bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-800"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    )}
    </DashboardLayout>
  );
}
