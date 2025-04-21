import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGuestInfo } from '../redux/guestSlice';

interface Props {
  onComplete: () => void;
}

export default function GuestCheckoutForm({ onComplete }: Props) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !address) {
      alert('Please fill in all fields');
      return;
    }

    dispatch(setGuestInfo({ name, email, address }));
    onComplete(); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold text-[#db7e21]">Guest Checkout</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        placeholder="Email or Phone"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <textarea
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <button type="submit" className="bg-[#db7e21] hover:bg-orange-500 text-white px-4 py-2 rounded">
        Continue to Checkout
      </button>
    </form>
  );
}
