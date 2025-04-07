import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaPhone, FaCalendar, FaSchool, FaBook } from 'react-icons/fa';
// import apiClient from '../services/apiClient';

const validationSchema = Yup.object({
  guardian_name: Yup.string()
    .min(2, 'Guardian name must be at least 2 characters')
    .required('Guardian name is required'),
  phone_number: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  dob: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  school_name: Yup.string()
    .min(2, 'School name must be at least 2 characters')
    .required('School name is required'),
  subject_interest: Yup.string()
    .required('Subject interest is required'),
});

const AdditionalInfo: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Authentication token not found');
        return;
      }

      // const response = await apiClient.post('/user/additional-info', values);
      setSuccessMessage('Additional information updated successfully!');
      
      // Update the user data in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...values };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Wait for a short time to show the success message
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || 'An error occurred while updating information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
            <p className="mt-1 text-sm text-gray-500">
              Please provide additional details to complete your profile
            </p>
          </div>

          {(successMessage || errorMessage) && (
            <div className={`px-6 py-4 ${successMessage ? 'bg-green-50' : 'bg-red-50'} border-l-4 ${successMessage ? 'border-green-400' : 'border-red-400'}`}>
              <p className={`text-sm ${successMessage ? 'text-green-700' : 'text-red-700'}`}>
                {successMessage || errorMessage}
              </p>
            </div>
          )}

          <div className="px-6 py-6 sm:px-8">
            <Formik
              initialValues={{
                guardian_name: '',
                phone_number: '',
                dob: '',
                school_name: '',
                subject_interest: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="guardian_name" className="block text-sm font-medium text-gray-700">
                        Guardian Name
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="h-5 w-5 text-blue-500" />
                        </div>
                        <Field
                          name="guardian_name"
                          type="text"
                          className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.guardian_name && touched.guardian_name ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Enter guardian's name"
                        />
                      </div>
                      <ErrorMessage name="guardian_name" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="h-5 w-5 text-blue-500" />
                        </div>
                        <Field
                          name="phone_number"
                          type="tel"
                          className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.phone_number && touched.phone_number ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <ErrorMessage name="phone_number" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendar className="h-5 w-5 text-blue-500" />
                        </div>
                        <Field
                          name="dob"
                          type="date"
                          className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.dob && touched.dob ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-blue-500 focus:border-blue-500`}
                        />
                      </div>
                      <ErrorMessage name="dob" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="school_name" className="block text-sm font-medium text-gray-700">
                        School Name
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSchool className="h-5 w-5 text-blue-500" />
                        </div>
                        <Field
                          name="school_name"
                          type="text"
                          className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.school_name && touched.school_name ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Enter school name"
                        />
                      </div>
                      <ErrorMessage name="school_name" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="subject_interest" className="block text-sm font-medium text-gray-700">
                        Subject Interest
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBook className="h-5 w-5 text-blue-500" />
                        </div>
                        <Field
                          as="select"
                          name="subject_interest"
                          className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                            errors.subject_interest && touched.subject_interest ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-blue-500 focus:border-blue-500`}
                        >
                          <option value="">Select a subject</option>
                          <option value="mathematics">Mathematics</option>
                          <option value="science">Science</option>
                          <option value="english">English</option>
                          <option value="history">History</option>
                          <option value="geography">Geography</option>
                        </Field>
                      </div>
                      <ErrorMessage name="subject_interest" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#1D2160] to-[#0EA9E1] px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0EA9E1] disabled:opacity-50 transition-all duration-300"
                    >
                      {isLoading ? 'Saving...' : 'Save Information'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo; 