import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; 
import { useEffect } from 'react';
import RedirectSpinner from '../components/RedirectSpinner'; 
import background from '../assets/UberEatsHomePage.jpg';



export default function Login() {
    const [formData, setFormData] = useState<{
        email: string;
        password: string;
        role: 'restaurant' | 'customer';
      }>({
        email: '',
        password: '',
        role: 'restaurant',
      });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isRedirecting, setIsRedirecting] = useState(false); 
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  

  const { token, role } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && role) {
      setIsRedirecting(true);
      setTimeout(() => {
        if (role === 'restaurant') {
          navigate('/dashboard/restaurant');
        } else {
          navigate('/dashboard/customer');
        }
      }, 1000);
    }
  }, [token, role, navigate]);

  if (isRedirecting) {
    return <RedirectSpinner />;
  }


  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); 
    setGeneralError(''); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData
      );
    
      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
          role: formData.role,
        })
      );
  
      localStorage.setItem('token', response.data.token);

      if (formData.role === 'restaurant') {
        navigate('/dashboard/restaurant');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            setGeneralError(err.response?.data?.error || 'Login failed');
          } else {
            setGeneralError('An unexpected error occurred');
          }
    }
  };
  if (token) return null;

  return (
<div
  className="min-h-screen bg-cover bg-center flex flex-col"
  style={{ backgroundImage: `url(${background})` }}
>  {/* Header */}
<div className="p-6 bg-white/80 backdrop-blur-sm text-[#db7e21] font-bold text-xl text-center shadow">
  Welcome to Uber Eats 🍔 — Please log in
</div>

{/* Centered Login Form */}
<div className="flex-1 flex items-center justify-center px-4">
  <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg mt-[-5vh]">
  <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Role */}
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="restaurant">Restaurant</option>
        <option value="customer">Customer</option>
      </select>

      {/* General error */}
      <div className="h-5">
        {generalError && (
          <p className="text-red-500 text-sm text-center">{generalError}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer bg-[#db7e21] hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded"
      >
        Login
      </button>
    </form>  </div>
</div>

</div>

  );
}
