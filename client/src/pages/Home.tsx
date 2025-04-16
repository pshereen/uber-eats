import background from '../assets/UberEatsHomePage-2.jpg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';


export default function Home() {
  const navigate = useNavigate();
  const { token, role } = useSelector((state: RootState) => state.auth);
  console.log('Token:', token);
  console.log('Role:', role);
  return (
    <div className="relative min-h-screen w-full text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${background})`,
        }}
      ></div>

      
      {/* Top right buttons */}
      <div className="absolute top-4 right-4 flex space-x-4 z-50 ">
        {!token ? (
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-white cursor-pointer text-black px-4 py-1 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/select-role')}
              className="bg-black text-white px-4 py-1 cursor-pointer rounded-full font-semibold hover:bg-gray-800 transition"
            >
              Sign up
            </button>
          </>
        ) : (
          <button
            onClick={() =>
              navigate(role === 'restaurant' ? '/dashboard/restaurant' : '/dashboard/customer')
            }
            className="bg-[#db7e21] cursor-pointer text-white px-4 py-1 rounded-full font-semibold hover:bg-orange-500 transition"
          >
            Go to Dashboard
          </button>
        )}
      </div>

      {/* Centered content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-4xl md:text-8xl font-semibold  mb-6">
          Order delivery near you
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-2 w-full max-w-3xl">
  <div className="flex items-center bg-white text-black px-4 py-3 rounded w-full md:w-[60%]">
    <span className="mr-2">📍</span>
    <input
      type="text"
      placeholder="Enter pin number"
      className="flex-1 outline-none bg-transparent font-semibold "
    />
  </div>

  <div className="flex items-center bg-white text-black px-4 py-3 rounded w-full md:w-[25%]">
    <span >🕒</span>
    <select className="flex-1 bg-transparent outline-none font-semibold ">
      <option>Deliver now</option>
      <option>Schedule for later</option>
    </select>
  </div>

  <button className="bg-black text-white font-semibold  cursor-pointer px-6 py-3 rounded hover:bg-gray-800 transition w-full md:w-auto whitespace-nowrap text-center">
  Search here
</button>

</div>


        <p className="mt-4 text-sm font-semibold ">
          Or{' '}
          <span 
            onClick={() => navigate('/login')}
            className="underline cursor-pointer hover:text-gray-300 font-semibold "
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
