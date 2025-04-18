import React from 'react';
import { MenuItem } from '../types/MenuItem';



interface Props {
  item: MenuItem;
  onClick: () => void;
}

export default function MenuItemCard({ item, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="w-80 border p-4 rounded flex items-center justify-between cursor-pointer hover:shadow transition"
      >
      <div className="flex-1 pr-4">
        <h2 className="text-lg font-semibold">{item.title}</h2>
        <p className="text-sm text-gray-500">{item.description}</p>
        <p className="text-sm mt-1 font-medium">${item.price.toFixed(2)}</p>
      </div>
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-20 h-20 object-cover rounded"
        />
      )}
    </div>
  );
}
