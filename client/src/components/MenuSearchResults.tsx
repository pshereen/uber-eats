import React, { useEffect, useState } from 'react';
import { MenuItem } from '../types/MenuItem';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import axios from 'axios';

type Props = {
  results: MenuItem[];
};

const MenuSearchResults: React.FC<Props> = ({ results }) => {
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [randomSuggestions, setRandomSuggestions] = useState<MenuItem[]>([]);

  const handleAddToCart = (item: MenuItem) => {
    const restaurant =
      typeof item.restaurant === 'string'
        ? { _id: item.restaurant, name: 'Unknown Restaurant' }
        : item.restaurant;

    dispatch(
      addToCart({
        ...item,
        quantity: 1,
        restaurant,
      })
    );
  };

  useEffect(() => {
    const fetchAllMenuItems = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/menu`);
        setAllMenuItems(res.data);
      } catch (err) {
        console.error('Error fetching all menu items:', err);
      }
    };

    fetchAllMenuItems();
  }, [API_URL]);

  useEffect(() => {
    if (results.length === 0 && allMenuItems.length > 0) {
      const shuffled = [...allMenuItems].sort(() => 0.5 - Math.random());
      setRandomSuggestions(shuffled.slice(0, 3));
    }
  }, [results, allMenuItems]);

  const displayItems = results.length > 0 ? results : randomSuggestions;

  return (
    <div className="bg-white text-black rounded-lg shadow-md w-[90%] max-w-3xl p-4 space-y-4 max-h-96 overflow-y-auto">
      {results.length === 0 && (
        <p className="text-sm text-gray-700 font-medium mb-4">
          😕 We couldn’t find what you’re looking for, but here are some popular items you might like:
        </p>
      )}

      {displayItems.map((item) => (
        <div key={item._id} className="flex gap-4 border-b pb-4">
          {item.image ? (
            <img
              src={`${API_URL}${item.image}`}
              alt={item.title}
              className="w-24 h-24 object-cover rounded"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}

          <div className="flex flex-col flex-grow justify-between">
            <div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-700">{item.description}</p>
              <p className="text-xs text-gray-500 italic mt-1">
                From:{' '}
                <span className="font-medium">
                  {typeof item.restaurant === 'string'
                    ? 'Unknown Restaurant'
                    : item.restaurant.name}
                </span>
              </p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="font-semibold text-sm">${item.price.toFixed(2)}</p>
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuSearchResults;
