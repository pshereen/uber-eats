import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setRestaurant } from '../../redux/restaurantSlice.bak';
import type { AppDispatch } from '../../redux/store';
import { setCredentials } from '../../redux/authSlice'
import { useNavigate } from 'react-router-dom';



export default function RestaurantRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    image: null as File | null,
  });
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('location', formData.location);
      data.append('role', 'restaurant');
      if (formData.image) {
        data.append('image', formData.image); 
      }
  
      const response = await axios.post('http://localhost:5000/api/restaurants/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      dispatch(setRestaurant(response.data.restaurant));
      dispatch(
        setCredentials({
          user: response.data.restaurant,
          token: response.data.token,
          role: 'restaurant',
        })
      );
      
      navigate('/dashboard/restaurant');
    } catch (err) {
      alert('Error registering restaurant.');
      console.error(err);
    }
  };
  
  

  return (
    <div className="max-w-xl mx-auto p-8 mt-12 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register Your Restaurant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" onChange={handleChange} placeholder="Restaurant Name" className="w-full p-2 border rounded" required />
        <input name="email" onChange={handleChange} placeholder="Email" type="email" className="w-full p-2 border rounded" required />
        <input name="password" onChange={handleChange} placeholder="Password" type="password" className="w-full p-2 border rounded" required />
        <input name="location" onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-[#db7e21] hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
