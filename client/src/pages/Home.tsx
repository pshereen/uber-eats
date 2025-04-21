import background from '../assets/UberEatsHomePage-2.jpg';
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { jwtDecode } from 'jwt-decode';
import MenuSearchResults from '../components/MenuSearchResults';
import { MenuItem } from '../types/MenuItem';
import { ShoppingCart } from 'lucide-react'; 

type JWTPayload = {
  exp: number;
};

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Token decoding failed:', error);
    return true;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const { token, role } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const tokenValid = token && !isTokenExpired(token);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MenuItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await axios.get(`${API_URL}/api/menu/search?query=${query}`);
      setResults(res.data);
      setHasSearched(true); 
    } catch (err) {
      console.error('Search error:', err);
    }
  };
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setHasSearched(false);
        setResults([]);
      }
    };

    if (hasSearched || results.length > 0) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hasSearched, results]);

  useEffect(() => {
    if (query.trim() === '') {
      setHasSearched(false);
      setResults([]);
    }
  }, [query]);

  return (
    <div className="relative min-h-screen w-full text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${background})` }}
      ></div>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Crave it, get it!
        </h1>

        {/* Search Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for dishes..."
            className="px-4 py-2 rounded-full text-white font-bold w-64 md:w-96 border border-gray-400 bg-transparent placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="bg-[#db7e21] px-4 py-2 rounded-full hover:bg-orange-500"
          >
            Search
          </button>
        </form>

        {/* Results Box */}
        {hasSearched && (
          <div ref={resultsRef}>
            <MenuSearchResults results={results} />
          </div>
        )}
      </div>

      {/* Auth Buttons & Cart */}
      <div className="absolute top-4 right-4 flex items-center space-x-4 z-20">
        {!tokenValid ? (
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-black px-4 py-1 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/select-role')}
              className="bg-black text-white px-4 py-1 rounded-full font-semibold hover:bg-gray-800 transition"
            >
              Sign up
            </button>
          </>
        ) : (
          <button
            onClick={() =>
              navigate(role === 'restaurant' ? '/restaurant/menu' : '/customer/browse')
            }
            className="bg-[#db7e21] text-white px-4 py-1 rounded-full font-semibold hover:bg-orange-500 transition"
          >
            Go to Dashboard
          </button>
        )}

        {/* Cart Icon */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate('/cart')}
          title="View Cart"
        >
          <ShoppingCart className="text-white w-6 h-6" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
