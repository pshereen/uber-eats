import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingCart } from 'lucide-react';
import background from '../assets/UberEatsHomePage-3.jpg';


export default function UserTypeSelection() {
  const [userType, setUserType] = useState<'restaurant' | 'customer'>('restaurant');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (userType === 'restaurant') {
      navigate('/restaurant/register');
    } else {
      navigate('/customer/register');
    }
  };

  return (
  <div
    className="min-h-screen bg-cover bg-center flex flex-col"
    style={{ backgroundImage: `url(${background})` }}
  >
    {/* Fixed Top Header */}
    <header className="w-full bg-white/80 backdrop-blur-sm py-4 shadow text-center text-xl font-semibold text-[#db7e21]">
      Welcome to Uber Eats 🍔 — Join as a Restaurant or Customer
    </header>

    <div className="flex-1 flex flex-col items-center justify-center px-4 text-black">
      <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center">

          {/* Restaurant Card */}
          <div
            onClick={() => setUserType('restaurant')}
            className={`cursor-pointer border rounded-lg px-6 py-8 w-full max-w-sm text-center transition-all flex flex-col justify-center h-44 ${
              userType === 'restaurant'
                ? 'border-[#db7e21] bg-orange-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="text-[#db7e21] mb-2">
              <Store size={32} className="mx-auto" />
            </div>
            <h2 className="text-lg font-medium mb-1">I'm a restaurant, selling food</h2>
            {userType === 'restaurant' && (
              <div className="mt-2 text-[#db7e21] font-semibold">Selected</div>
            )}
          </div>

          {/* Customer Card */}
          <div
            onClick={() => setUserType('customer')}
            className={`cursor-pointer border rounded-lg px-6 py-8 w-full max-w-sm text-center transition-all flex flex-col justify-center h-44 ${
              userType === 'customer'
                ? 'border-[#db7e21] bg-orange-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="text-[#db7e21] mb-2">
              <ShoppingCart size={32} className="mx-auto" />
            </div>
            <h2 className="text-lg font-medium mb-1">I'm a customer, ordering food</h2>
            {userType === 'customer' && (
              <div className="mt-2 text-[#db7e21] font-semibold">Selected</div>
            )}
          </div>

        </div>
        

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          className="mt-10 px-6 py-3 bg-[#db7e21] hover:bg-orange-500 text-lg text-white font-semibold rounded-md cursor-pointer"
        >
          Join as a {userType === 'restaurant' ? 'Restaurant' : 'Customer'}
        </button>

        <p className="mt-4 text-lg text-white font-semibold">
          Already have an account?{' '}
          <span
            className="text-[#db7e21] underline cursor-pointer font-bold"
            onClick={() => navigate('/login')}
          >
            Log In
          </span>
        </p>
      </div>
  </div>
  );
}
