import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const AddBathroom = ({ onClose, onBathroomAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    building: '',
    floor: '',
    lat: '',
    lng: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      const bathroomData = {
        name: formData.name,
        location: formData.address,
        geoLocation: {
          type: 'Point',
          coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)], // [lng, lat]
          address: formData.address,
          building: formData.building,
          floor: formData.floor,
        },
        addedBy: user.id,
        amenities: {
          accessible: false,
          genderNeutral: false,
          soap: true,
          paperTowels: true,
        }
      };

      const response = await axios.post(`${API_URL}/bathrooms`, bathroomData);
      
      onBathroomAdded(response.data);
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to add bathroom';
      setError(errorMessage);
      setLoading(false);
      
      // If it's a location validation error, provide helpful guidance
      if (errorMessage.includes('NYU campus location')) {
        setError(`${errorMessage}\n\n💡 Make sure your coordinates are within NYU campus boundaries:\n• Washington Square area: lat 40.725-40.735, lng -74.002 to -73.990\n• Brooklyn MetroTech: lat 40.690-40.697, lng -73.990 to -73.980`);
      }
    }
  };

  // Quick add NYU bathrooms
  const addNYUBathroom = async (name, lat, lng, address, building) => {
    setFormData({ name, address, building, floor: '', lat: lat.toString(), lng: lng.toString() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-propaganda text-blue-uncensored">ADD A SH*T SPOT</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 whitespace-pre-line">
            {error}
          </div>
        )}

        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>📍 NYU Locations Only:</strong> Only bathrooms at NYU campus locations (Washington Square or Brooklyn MetroTech) can be added.
          </p>
        </div>

        {/* Quick Add NYU Bathrooms */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-uncensored mb-3">Quick Add NYU Bathrooms:</h3>
          <div className="space-y-2">
            <button
              onClick={() => addNYUBathroom('Bobst Library LL1', 40.7291, -73.9965, '70 Washington Square S', 'Bobst Library')}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
            >
              + Bobst Library LL1
            </button>
            <button
              onClick={() => addNYUBathroom('Kimmel Center 3rd Floor', 40.7300, -73.9970, '60 Washington Square S', 'Kimmel Center')}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
            >
              + Kimmel Center 3rd Floor
            </button>
            <button
              onClick={() => addNYUBathroom('Tisch Hall 2nd Floor', 40.7295, -73.9975, '40 W 4th St', 'Tisch Hall')}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
            >
              + Tisch Hall 2nd Floor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Bathroom Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="e.g., Bobst Library LL1"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Address *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="70 Washington Square S"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Building</label>
              <input
                type="text"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Bobst Library"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Floor</label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="LL1"
              />
            </div>
          </div>



          <p className="text-xs text-gray-500">
            💡 Tip: Right-click on Google Maps and select the coordinates to copy lat/lng
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Bathroom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBathroom;