import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import MenuItemCard from '../../components/restaurant/MenuItemCard';
import EditMenuItemModal from '../../components/restaurant/EditMenuItemModal';
import AddMenuItemModal from '../../components/restaurant/AddMenuItemModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { MenuItem } from '../../types/MenuItem';
const API_URL = import.meta.env.VITE_API_URL;

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editedItem, setEditedItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  console.log('User from Redux:', user);
  const restaurantId = user?._id;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        console.log('Fetching menu items for restaurant:', restaurantId);
        if (!restaurantId) return;
        console.log('API URL:', API_URL);
        const response = await axios.get(`${API_URL}/api/menu?restaurant=${restaurantId}`);
        console.log('Fetched menu items:', response.data);
        const itemsWithFullImageURLs = response.data.map((item: MenuItem) => ({
          ...item,
          image: item.image ? `${API_URL}${item.image}` : undefined,
        }));

        setMenuItems(itemsWithFullImageURLs);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const handleEdit = (item: MenuItem) => {
    setEditedItem({ ...item });
  };

  const handleSave = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
    );
    setEditedItem(null);
  };

  const handleCancel = () => {
    setEditedItem(null);
  };

  const handleAddItem = (item: MenuItem) => {
    setMenuItems((prev) => [...prev, item]);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage menu</h1>
            <p className="text-gray-600">Click on dish to update details</p>
          </div>
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add new dish
          </button>
        </div>

        {showAddForm && restaurantId && (
          <AddMenuItemModal
            onAdd={handleAddItem}
            onClose={() => setShowAddForm(false)}
            restaurantId={restaurantId}
          />
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <MenuItemCard key={item._id} item={item} onClick={() => handleEdit(item)} />
          ))}
        </div>

        {editedItem && (
          <EditMenuItemModal
            item={editedItem}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
