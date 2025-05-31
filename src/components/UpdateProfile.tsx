import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../services/apiServices';

interface UserData {
  name: string;
  email: string;
  grade: string;
  board: string;
  guardian_name?: string;
  phone_number?: string;
  dob?: string;
  school?: string;
  div?: string;
  pincode?: string;
  subject_interest?: string;
}

interface UpdateProfileProps {
  userData: UserData;
  onClose: () => void;
  onUpdateSuccess: (data: UserData) => void;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ userData, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<UserData>(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Create the update payload in the required format
    const updatePayload = {
      name: formData.name,
      board: formData.board,
      grade: formData.grade,
      school: formData.school || '',
      div: formData.div || '',
      pincode: formData.pincode || ''
    };

    try {
      const response = await apiClient.put(API_ENDPOINTS.UpdateProfile, updatePayload);
      
      // Immediately update formData with response
      const updatedData = response.data;
      setFormData(updatedData);
      
      // Update local storage with the latest data
      localStorage.setItem('user', JSON.stringify(updatedData));
      
      // Directly update userData in parent component with the form data
      // This ensures we see changes even if API response format differs
      onUpdateSuccess({
        ...userData,
        ...updatePayload
      });
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full p-2 rounded-lg border-blue-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full p-2 rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  name="grade"
                  id="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="board" className="block text-sm font-medium text-gray-700 mb-1">
                  Board
                </label>
                <input
                  type="text"
                  name="board"
                  id="board"
                  value={formData.board}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  name="school"
                  id="school"
                  value={formData.school || ''}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="div" className="block text-sm font-medium text-gray-700 mb-1">
                  Division
                </label>
                <input
                  type="text"
                  name="div"
                  id="div"
                  value={formData.div || ''}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  id="pincode"
                  value={formData.pincode || ''}
                  onChange={handleChange}
                  maxLength={6}
                  pattern="\d{6}"
                  disabled={isLoading}
                  className="w-full p-2 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-8 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-8 py-2.5 min-w-[120px] border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2.5 min-w-[120px] bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile; 