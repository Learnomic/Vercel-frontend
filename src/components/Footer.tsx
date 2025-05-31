import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-100 to-blue-200 text-black mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Learnomic</h3>
            <p className="text-black-200 mb-4">
              Empowering students with interactive learning experiences and personalized education.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-black hover:text-black-200 transition-colors duration-200">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="#" className="text-black hover:text-black-200 transition-colors duration-200">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-black hover:text-black-200 transition-colors duration-200">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-black hover:text-black-200 transition-colors duration-200">
                <FaLinkedinIn className="h-5 w-5" />
              </a>
              <a href="#" className="text-black hover:text-black-200 transition-colors duration-200">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-black-200 hover:text-black transition-colors duration-200">Home</Link></li>
              <li><Link to="/subjects" className="text-black-200 hover:text-black transition-colors duration-200">Learn</Link></li>
              <li><Link to="/about" className="text-black-200 hover:text-black transition-colors duration-200">About</Link></li>
              <li><Link to="/signup" className="text-black-200 hover:text-black transition-colors duration-200">Dashboard</Link></li>
              <li><Link to="/" className="text-black-200 hover:text-black transition-colors duration-200">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-black-200 space-y-2">
              <p>3rd Floor, Siddhaganga Plaza, No.12/1, 6/5,Kanakapura Main Road,Above Apple Fitness and Reliance Digital,
Raghuvanahalli, Bengaluru, Karnataka- 560062</p> 
              {/* <p>3rd Floor, Siddhaganga Plaza, No. 12/1, 6/5,</p>
              <p>Kanakapura Main Road, , 
              Above Apple Fitness and Reliance Digital,
              Raghuvanahalli, Bengaluru, Karnataka 560062 Nearest Metro Station: Vajrahalli Metro Station</p>
              */}
              <p><b>Phone:</b>  +91 7411620955</p> 
              <p><b>Email:</b> learnomicindia@outlook.com</p>
              
            </address>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-6 border-t border-blue-400 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-black-200 text-sm">
            &copy; {new Date().getFullYear()} Learnomic. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-black-200 hover:text-black transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms" className="text-black-200 hover:text-black transition-colors duration-200">Terms of Service</Link>
            <Link to="/cookies" className="text-black-200 hover:text-black transition-colors duration-200">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;