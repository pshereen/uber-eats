import background from '../assets/UberEatsHomePage-2.jpg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { jwtDecode } from 'jwt-decode';

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
  const tokenValid = token && !isTokenExpired(token);

  return (
    <div className="relative min-h-screen w-full text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${background})` }}
      ></div>

      {/* Centered Slogan */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Crave it, get it!
        </h1>
      </div>

      {/* Top Right Buttons */}
      <div className="absolute top-4 right-4 flex space-x-4 z-20">
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
      </div>
    </div>
  );
}
