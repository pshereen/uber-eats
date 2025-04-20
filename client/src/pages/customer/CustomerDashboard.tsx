import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout.bak';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/authSlice';

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/customers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, [API_URL, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage('❌ No token found. Please log in again.');
      return;
    }
  
    try {
      const res = await axios.put(`${API_URL}/api/customers/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      dispatch(
        setCredentials({
          user: res.data,
          token,
          role: 'customer',
        })
      );
  
      setMessage('✅ Profile updated successfully!');
      setFormData(res.data);
    } catch (err) {
      console.error('Update failed:', err);
      setMessage('❌ Failed to update profile.');
    }
  };
  

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">🛒 Customer Dashboard</h1>
      <p className="mb-6 text-gray-600">View and edit your profile below.</p>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Name"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Location"
        />
        <button
          type="submit"
          className="bg-[#db7e21] text-white font-semibold py-2 px-4 rounded hover:bg-orange-600"
        >
          Save Changes
        </button>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </form>
    </DashboardLayout>
  );
}
