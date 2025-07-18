import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#000980] text-white pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <span style={{ fontFamily: "'Bauhaus 93', sans-serif", color: '#0BA5C6' }}>Laundry</span>
            </h3>
            <p className="mb-4 text-gray-300">
              Professional laundry and dry cleaning services with a commitment to quality, sustainability, and customer satisfaction.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 border-b border-[#0BA5C6] pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Services</Link></li>
              <li><Link to="/prices" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 border-b border-[#0BA5C6] pb-2">Our Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services/wash-fold" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Wash & Fold</Link></li>
              <li><Link to="/services/dry-cleaning" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Dry Cleaning</Link></li>
              <li><Link to="/services/ironing" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Premium Pressing</Link></li>
              <li><Link to="/services/stain-removal" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Stain Removal</Link></li>
              <li><Link to="/services/commercial" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Commercial Laundry</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-[#0BA5C6] pb-2">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-[#0BA5C6] mr-3 mt-1" />
                <span className="text-gray-300">123 Laundry St, Clean City, CC 12345</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="text-[#0BA5C6] mr-3 mt-1" />
                <span className="text-gray-300">+234 456 7890</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="text-[#0BA5C6] mr-3 mt-1" />
                <span className="text-gray-300">info@laundry.com</span>
              </li>
              <li className="flex items-start">
                <FaClock className="text-[#0BA5C6] mr-3 mt-1" />
                <span className="text-gray-300">Mon-Fri: 8AM-8PM<br />Sat-Sun: 9AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-[#0A6FC2] rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-xl font-semibold mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-gray-200">Get updates on special offers and laundry tips</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-l-lg bg-white w-full focus:outline-none text-gray-800"
              />
              <button className="bg-[#0BA5C6] hover:bg-[#098fb4] px-6 py-3 rounded-r-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#0A6FC2] pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Laundry. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">Terms of Service</Link>
            <Link to="/faq" className="text-gray-300 hover:text-[#0BA5C6] transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;