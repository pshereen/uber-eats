import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCustomer } from '../../redux/customerSlice'; 
import type { AppDispatch } from '../../redux/store';
import { setCredentials } from '../../redux/authSlice'
import { useNavigate } from 'react-router-dom';


export default function CustomerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestData = {
        ...formData,
        role: 'customer', 
      };
  
      const response = await axios.post('http://localhost:5000/api/customers/register', requestData);
  
      dispatch(setCustomer(response.data.customer));
      dispatch(
        setCredentials({
          user: response.data.customer,
          token: response.data.token,
          role: 'customer',
        })
      );
  
      navigate('/dashboard/customer');
    } catch (err) {
      alert('Error registering customer.');
      console.error(err);
    }
  };
  

  return (
    <div className="max-w-xl mx-auto p-8 mt-12 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register as Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" onChange={handleChange} placeholder="Your Name" className="w-full p-2 border rounded" required />
        <input name="email" onChange={handleChange} placeholder="Email" type="email" className="w-full p-2 border rounded" required />
        <input name="password" onChange={handleChange} placeholder="Password" type="password" className="w-full p-2 border rounded" required />
        <input name="location" onChange={handleChange} placeholder="Location (optional)" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
