import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/authSlice';
import { NavLink, useNavigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/');
  };

  const linkStyle =
    'block hover:text-[#db7e21] transition';
  const activeStyle =
    'text-[#db7e21] font-semibold';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-[#db7e21]">
          {role === 'restaurant' ? '🍽️ Restaurant' : '🛒 Customer'}
        </h2>
        <ul className="space-y-4 text-gray-700 font-medium">
          {role === 'restaurant' ? (
            <>
              <li>
                <NavLink
                  to="/dashboard/restaurant"
                  end
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : ''}`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/restaurant/menu"
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : ''}`
                  }
                >
                  Menu Items
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/restaurant/orders"
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : ''}`
                  }
                >
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/restaurant/settings"
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : ''}`
                  }
                >
                  Settings
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/dashboard/customer"
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : ''}`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/customer/browse"
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : ''}`
                  }
                >
                  Browse Restaurants
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/customer/orders"
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : ''}`
                  }
                >
                  My Orders
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
            {role === 'restaurant' ? '🍽️ Restaurant Panel' : '🛒 Customer Panel'}
          </div>
          <div className="flex items-center gap-4">
            <span>👤 {user?.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="bg-white cursor-pointer text-[#db7e21] font-semibold px-4 py-1 rounded hover:bg-orange-100 transition"
            >
              Logout
            </button>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
