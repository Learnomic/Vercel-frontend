import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { FaUser, FaEnvelope, FaGraduationCap, FaSchool, FaInfoCircle, FaPhone, FaCalendar, FaBook, FaPencilAlt } from 'react-icons/fa';
import { API_ENDPOINTS } from '../services/apiServices';

interface UserData {
  name: string;
  email: string;
  grade: string;
  board: string;
  guardian_name?: string;
  phone_number?: string;
  dob?: string;
  school_name?: string;
  subject_interest?: string;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    grade: '',
    board: '',
    guardian_name: '',
    phone_number: '',
    dob: '',
    school_name: '',
    subject_interest: ''
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
        const response = await apiClient.get(API_ENDPOINTS.GetProfile);
        console.log('Profile Data:', response.data);
        
        const profileData = response.data;
        setUserData(profileData);
        setFormData(profileData);
        localStorage.setItem('user', JSON.stringify(profileData));
        setError('');
      } catch (err: any) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile data. Please try again later.');
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

    try {
      const response = await apiClient.put(API_ENDPOINTS.UpdateProfile, formData);
      setUserData(response.data);
      setIsEditing(false);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  py-12 px-4 sm:px-6">
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

  // Update the subject interests handling
  const subjectInterests = Array.isArray(userData.subject_interest) 
    ? userData.subject_interest 
    : userData.subject_interest 
      ? [userData.subject_interest] 
      : [];

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40  rounded-full opacity-70 blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40  rounded-full opacity-70 blur-xl"></div>
          
          <div className="relative z-10 p-8 flex flex-col md:flex-row gap-8">
            {/* Profile Image and Name Section */}
            <div className="flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&color=fff&size=128`} 
                  alt={userData.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{userData.name}</h1>
              <div className="flex items-center space-x-2 text-indigo-600">
                <FaGraduationCap />
                <span>Grade {userData.grade}</span>
              </div>
              <div className="mt-2 text-gray-700">{userData.board}</div>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm shadow-md hover:bg-blue-700 transition-all"
                >
                  <FaPencilAlt />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaEnvelope className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{userData.email}</p>
                    </div>
                  </div>
                  
                  {userData.guardian_name && (
                    <div className="flex items-start space-x-3">
                      <FaUser className="text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Guardian</p>
                        <p className="text-gray-800">{userData.guardian_name}</p>
                      </div>
                    </div>
                  )}
                  
                  {userData.phone_number && (
                    <div className="flex items-start space-x-3">
                      <FaPhone className="text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-800">{userData.phone_number}</p>
                      </div>
                    </div>
                  )}
                  
                  {userData.dob && (
                    <div className="flex items-start space-x-3">
                      <FaCalendar className="text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="text-gray-800">{new Date(userData.dob).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Academic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Academic Information</h2>
                <div className="space-y-4">
                  {userData.school_name && (
                    <div className="flex items-start space-x-3">
                      <FaSchool className="text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">School</p>
                        <p className="text-gray-800">{userData.school_name}</p>
                      </div>
                    </div>
                  )}
                  
                  {subjectInterests.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Subjects of Interest</p>
                      <div className="flex flex-wrap gap-2">
                        {subjectInterests.map((subject, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-8 pb-8 flex justify-end space-x-3">
            <button
              onClick={() => navigate('/additional-info')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-all"
            >
              <FaInfoCircle />
              <span>Additional Info</span>
            </button>
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
          
          {isEditing && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
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
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
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
                      disabled={isLoading}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
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
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
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
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 