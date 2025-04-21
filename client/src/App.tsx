import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RestaurantRegister from './pages/restaurant/RestaurantRegister';
import CustomerRegister from './pages/customer/CustomerRegister';
import UserTypeSelection from './pages/UserTypeSelection';
import Login from './pages/Login';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MenuItems from './pages/restaurant/MenuItems';
import RestaurantOrdersPage from './pages/restaurant/RestaurantOrdersPage';
import RestaurantSettings from './pages/restaurant/RestaurantSettings';
import BrowseRestaurants from './pages/customer/BrowseRestaurants';
import ShoppingCart from './pages/customer/ShoppingCart';
import OrdersPage from './pages/customer/Orders';



function App() {
  return (
    <Router basename="/uber-eats">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/register" element={<RestaurantRegister />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/select-role" element={<UserTypeSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route
          path="/customer/settings"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/menu"
          element={
            <ProtectedRoute allowedRoles={['restaurant']}>
              <MenuItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/settings"
          element={
            <ProtectedRoute allowedRoles={['restaurant']}>
              <RestaurantSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/orders"
          element={
            <ProtectedRoute allowedRoles={['restaurant']}>
              <RestaurantOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/browse"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <BrowseRestaurants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
