import React, { useRef, useState } from 'react';
import axios from 'axios';
import { MenuItem, NewMenuItem } from '../../types/MenuItem';


type Props = {
  onAddSuccess: (item: MenuItem) => void;
  restaurantId: string;
};

export default function AddMenuItemForm({ onAddSuccess, restaurantId }: Props) {
  const [newItem, setNewItem] = useState<NewMenuItem & { imageFile?: File }>({
    title: '',
    description: '',
    price: 0,
  });

  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewItem((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', newItem.title);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price.toString());
    formData.append('restaurantId', restaurantId);
    if (newItem.imageFile) {
      formData.append('image', newItem.imageFile);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/menu/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onAddSuccess(res.data); // Send the new item back to the parent
      setNewItem({ title: '', description: '', price: 0 });
      setPreview('');
    } catch (error) {
      console.error('Error uploading item:', error);
      alert('Failed to add item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <h2 className="text-xl font-semibold mb-2">➕ Add New Item</h2>

      <input
        type="text"
        placeholder="Title"
        className="block w-full p-2 border rounded"
        value={newItem.title}
        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
        required
      />

      <textarea
        placeholder="Description"
        className="block w-full p-2 border rounded"
        value={newItem.description}
        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Price"
        className="block w-full p-2 border rounded"
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
        required
      />

      <div className="border border-dashed border-gray-400 p-4 text-center rounded">
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-32 object-cover mb-2 rounded"
          />
        )}
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

      <button
        type="submit"
        className="bg-[#db7e21] hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded"
      >
        Add Item
      </button>
    </form>
  );
}
