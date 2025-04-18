// src/components/MenuModal.tsx
import React, { useState } from 'react';
import { MenuItem } from '../../types/MenuItem';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  menu: MenuItem[];
  onOrder: (item: MenuItem, quantity: number) => void;
}

export default function MenuModal({
  isOpen,
  onClose,
  restaurantName,
  menu,
  onOrder,
}: MenuModalProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  if (!isOpen) return null;

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, value), // Ensure quantity is at least 1
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl">
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#db7e21]">Menu from {restaurantName}</h2>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {menu.map((item) => (
            <div key={item._id} className="border p-3 rounded-lg shadow-sm">
              <div className="flex gap-4">
                {item.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${item.image}`}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm font-medium mt-1">💲{item.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <label htmlFor={`qty-${item._id}`} className="text-sm">
                      Quantity:
                    </label>
                    <input
                      id={`qty-${item._id}`}
                      type="number"
                      min={1}
                      value={quantities[item._id] ?? 1}
                      onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                      className="w-16 border rounded px-2 py-1"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 text-right">
                <button
                  onClick={() => onOrder(item, quantities[item._id] ?? 1)}
                  className="bg-[#db7e21] hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
