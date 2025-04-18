import React from 'react';
import AddMenuItemForm from './AddMenuItemForm';
import { MenuItem } from '../types/MenuItem';


type Props = {
  onClose: () => void;
  onAdd: (item: MenuItem) => void;
  restaurantId: string;
};

export default function AddMenuItemModal({ onClose, onAdd, restaurantId  }: Props) {
  const handleAddAndClose = (item: MenuItem) => {
    onAdd(item);     
    onClose();       
  };

  return (
    <div className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <AddMenuItemForm onAddSuccess={handleAddAndClose} restaurantId={restaurantId}/>
      </div>
    </div>
  );
}
