import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import { setCredentials } from '../redux/authSlice';

export default function RestaurantSettings() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    image: null as File | null,
  });
  const rawImage = user?.role === 'restaurant' && user.image ? user.image : null;
console.log('user:', user);
console.log('rawImage:', rawImage);
  const [preview, setPreview] = useState<string | null>(rawImage ? `${API_URL}${rawImage}` : null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id || !token) return;

    try {
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('location', formData.location);
      if (formData.image) updateData.append('image', formData.image);

      const response = await axios.put(`${API_URL}/api/restaurants/${user._id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(setCredentials({
        user: response.data.updatedRestaurant,
        token,
        role: 'restaurant',
      }));

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update restaurant info');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
        <h2 className="text-2xl font-bold text-[#db7e21]">⚙️ Restaurant Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Restaurant Name"
            required
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Location"
          />
          <div className="space-y-2">
            {preview && <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded" />}
            <input
              type="file"
              name="image"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Change Banner Image
            </button>
          </div>
          <button
            type="submit"
            className="bg-[#db7e21] hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
