import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RestaurantUser } from '../../types/UserTypes';
import { MenuItem } from '../../types/MenuItem';
import DashboardLayout from '../../components/DashboardLayout';
import MenuModal from '../../components/customer/MenuModal';

export default function BrowseRestaurants() {
  const [restaurants, setRestaurants] = useState<RestaurantUser[]>([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<RestaurantUser[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantUser | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

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

  const handleOrder = (item: MenuItem) => {
    alert(`🛒 Order placed for ${item.title} at $${item.price.toFixed(2)}`);
    // Future: Add API call to actually place the order
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-[#db7e21]">🍽️ Browse Restaurants</h1>

        {/* 🔍 Search Field */}
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md mb-6 p-2 border rounded shadow-sm"
        />

        {/* Restaurant Cards */}
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
        onOrder={handleOrder}
      />
    </DashboardLayout>
  );
}
