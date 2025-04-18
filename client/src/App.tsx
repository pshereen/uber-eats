import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RestaurantRegister from './pages/RestaurantRegister';
import CustomerRegister from './pages/CustomerRegister';
import UserTypeSelection from './pages/UserTypeSelection';
import Login from './pages/Login';
import RestaurantDashboard from './pages/RestaurantDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MenuItems from './pages/MenuItems';
import RestaurantSettings from './pages/RestaurantSettings';

function App() {
  return (
    <Router basename="/uber-eats">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/register" element={<RestaurantRegister />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/select-role" element={<UserTypeSelection />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard/restaurant"
          element={
            <ProtectedRoute allowedRoles={['restaurant']}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/customer"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/restaurant/menu"
          element={
            <ProtectedRoute allowedRoles={['restaurant']}>
              <MenuItems />
            </ProtectedRoute>
          }
        />
        <Route
  path="/dashboard/restaurant/settings"
  element={
    <ProtectedRoute allowedRoles={['restaurant']}>
      <RestaurantSettings />
    </ProtectedRoute>
  }
/>


      </Routes>
    </Router>
  );
}

export default App;
