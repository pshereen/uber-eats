import React, { useRef } from 'react';
import { MenuItem } from '../types/MenuItem';


type Props = {
  item: MenuItem;
  onCancel: () => void;
  onSave: (updatedItem: MenuItem) => void;
};

export default function EditMenuItemModal({ item, onCancel, onSave }: Props) {
  const [editedItem, setEditedItem] = React.useState<MenuItem>(item);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (field: keyof MenuItem, value: string | number) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedItem((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4">Update dish details</h2>

        {editedItem.image && (
          <div className="mb-4">
            <img src={editedItem.image} alt="Dish" className="w-full h-40 object-cover rounded" />
          </div>
        )}

        <div className="mb-4 border border-dashed border-gray-400 p-4 rounded text-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Browse files
          </button>
          <p className="text-sm mt-2 text-gray-600">Upload dish image</p>
        </div>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Dish Name"
          value={editedItem.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />

        <textarea
          className="w-full mb-3 p-2 border rounded"
          placeholder="Dish Description"
          value={editedItem.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />

        <input
          type="number"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Dish Price"
          value={editedItem.price}
          onChange={(e) => handleChange('price', parseFloat(e.target.value))}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button
            onClick={() => onSave(editedItem)}
            className="px-4 py-2 bg-[#db7e21] text-white rounded hover:bg-orange-500"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
