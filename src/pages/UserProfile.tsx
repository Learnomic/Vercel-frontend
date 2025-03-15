import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaGraduationCap, FaSchool } from 'react-icons/fa';

interface UserData {
  name: string;
  email: string;
  grade: string;
  board: string;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    grade: '',
    board: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>(userData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Extract only the fields we want to display
        const { name, email, grade, board } = response.data;
        const profileData = { name, email, grade, board };
        
        setUserData(profileData);
        setFormData(profileData);
        setError('');
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load profile data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

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

    const updateData = {
      name: formData.name,
      email: formData.email,
      grade: formData.grade,
      board: formData.board
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/user/profile', updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Extract only the fields we want to display
      const { name, email, grade, board } = response.data;
      const profileData = { name, email, grade, board };
      
      setUserData(profileData);
      setIsEditing(false);
      localStorage.setItem('user', JSON.stringify(profileData));
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to update profile. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
          <div className="px-6 py-8 sm:px-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account information and preferences
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-[#1D2160] to-[#0EA9E1] px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {!isEditing ? (
            <div className="px-6 py-6 sm:px-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <FaUser className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="mt-1 text-lg font-medium text-gray-900">{userData.name}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FaEnvelope className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="mt-1 text-lg font-medium text-gray-900">{userData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FaGraduationCap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Grade</p>
                      <p className="mt-1 text-lg font-medium text-gray-900">{userData.grade}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FaSchool className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Board</p>
                      <p className="mt-1 text-lg font-medium text-gray-900">{userData.board}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="grade"
                      id="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="board" className="block text-sm font-medium text-gray-700">
                    Board
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSchool className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="board"
                      id="board"
                      value={formData.board}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(userData);
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#1D2160] to-[#0EA9E1] px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0EA9E1] disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 