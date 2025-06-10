import React from 'react';
import { FaExclamationTriangle, FaSignInAlt, FaTimes } from 'react-icons/fa';

interface LoginWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onContinue: () => void;
}

const LoginWarningModal: React.FC<LoginWarningModalProps> = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  onContinue 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Login Required
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          You are not logged in. If you continue without logging in, your quiz progress and results will not be saved.
        </p>

        {/* Warning Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center text-red-700">
            <FaExclamationTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="font-medium text-sm">
              Progress will not be saved without login
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <FaSignInAlt className="w-4 h-4 mr-2" />
            Login
          </button>
          
          <button
            onClick={onContinue}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Skip & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginWarningModal;