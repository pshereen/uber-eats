import DashboardLayout from '../../components/DashboardLayout';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function RestaurantDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;

  const rawImage = user?.role === 'restaurant' && user.image ? user.image : null;
  const bannerImage = rawImage ? `${API_URL}${rawImage}` : null;
  console.log('User:', user);
console.log('rawImage:', rawImage);
console.log('bannerImage:', bannerImage);

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {bannerImage && (
          <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow">
            <img
              src={bannerImage}
              alt="Restaurant Banner"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-[#db7e21]">🍽️ Restaurant Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Monitor your sales, orders, and performance at a glance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <SummaryCard title="Orders Today" value="42" />
          <SummaryCard title="Earnings" value="$312.00" />
          <SummaryCard title="Pending Orders" value="6" />
          <SummaryCard title="Menu Items" value="18" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="📈 Sales Trend" />
          <ChartCard title="🔥 Popular Menu Items" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">🧾 Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="text-gray-600 border-b">
                <tr>
                  <th className="py-2 pr-4">Order ID</th>
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Items</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4 font-medium">#00123</td>
                  <td className="py-2 pr-4">John D.</td>
                  <td className="py-2 pr-4">3</td>
                  <td className="py-2 pr-4">$29.99</td>
                  <td className="py-2 text-orange-600 font-semibold">Preparing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border-l-4 border-[#db7e21] rounded-xl shadow px-4 py-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function ChartCard({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
        [Chart Placeholder]
      </div>
    </div>
  );
}
