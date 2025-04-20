import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/authSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconListDetails,
  IconClipboardList,
  IconShoppingCart,
  IconHome2,
  IconUser,
} from '@tabler/icons-react';

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((state: RootState) => state.auth);
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkStyle = 'block hover:text-[#db7e21] transition';
  const activeStyle = 'text-[#db7e21] font-semibold';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-[#db7e21]">
          {role === 'restaurant' ? 'Restaurant' : 'Customer'}
        </h2>
        <ul className="space-y-4 text-gray-700 font-medium">
          {role === 'restaurant' ? (
            <>
              <li>
                <NavLink
                  to="/restaurant/menu"
                  className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <IconListDetails size={18} /> Menu Items
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/restaurant/orders"
                  className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <IconClipboardList size={18} /> Orders
                  </div>
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/customer/browse"
                  className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <IconHome2 size={18} /> Browse Restaurants
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/customer/orders"
                  className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <IconShoppingCart size={18} /> My Orders
                  </div>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </aside>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-[#db7e21] text-white px-6 py-4 flex justify-between items-center shadow">
          <div className="font-bold text-lg">
            {role === 'restaurant' ? 'Restaurant Panel' : 'Customer Panel'}
          </div>

          <div className="flex items-center gap-4 relative" ref={dropdownRef}>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 font-semibold hover:text-gray-100"
            >
              <IconUser size={20} />
              {user?.name || 'User'}
              <IconChevronDown
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                size={18}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white text-black rounded shadow-md z-50">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(`/${role}/settings`);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  <IconSettings size={18} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  <IconLogout size={18} /> Logout
                </button>
              </div>
            )}

            {role === 'customer' && (
              <div
                className="relative cursor-pointer hover:text-gray-100"
                onClick={() => navigate('/customer/cart')}
              >
                <IconShoppingCart size={26} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#db7e21] text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                    {cartCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
