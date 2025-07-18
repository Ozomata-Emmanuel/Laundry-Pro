import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import BackToTop from '../../components/BackToTop';

const Contact = () => {
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className=" bg-gray-50">
      <BackToTop/>
      <section 
        className="h-[70vh] flex items-center justify-center text-center text-gray-50"
        style={{
          background: 'linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url(https://static.vecteezy.com/system/resources/previews/040/261/632/non_2x/ai-generated-modern-laundromat-with-row-of-washing-machines-with-ai-generated-free-photo.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        < div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          
        >
          <h1 style={{ fontFamily: "'Bauhaus 93', sans-serif" }} className="text-6xl font-light mb-4">
            Contact Us
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have questions or need assistance? Our team is ready to help.
          </p>
        </ div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're an electrical contractor, a facility manager, or a homeowner, we provide the right materials and expertise to support your projects.
            </p>
          </ div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">
                Send Us a Message
              </h3>
              <form
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-l-2xl rounded-br-2xl focus:outline-none     transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-l-2xl rounded-br-2xl focus:outline-none     transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-l-2xl rounded-br-2xl focus:outline-none     transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-l-2xl rounded-br-2xl focus:outline-none     transition-all resize-y"
                  ></textarea>
                </div>
                
                <button className="px-8 py-4 bg-gray-900 text-gray-50 border-none rounded-l-2xl rounded-br-2xl font-semibold text-base cursor-pointer transition-all hover:bg-gray-800 justify-self-start">
                  Send Message
                </ button>
              </form>
            </ div>
            
            <div className="bg-[#c6cdf5] p-10 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">
                Contact Information
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#e1e3ee] rounded-full flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-xl text-gray-900" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Our Address
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      123 Abc street, Electrical Avenue<br />
                      Industrial District<br />
                      Abuja, Nigeria
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#e1e3ee] rounded-full flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-xl text-gray-900" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Phone
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Main: +234 123 456 7890<br />
                      Sales: +234 123 456 7891<br />
                      Support: +234 123 456 7892
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#e1e3ee] rounded-full flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-xl text-gray-900" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Email
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      info@integratedelectrical.com<br />
                      sales@integratedelectrical.com<br />
                      support@integratedelectrical.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#e1e3ee] rounded-full flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-xl text-gray-900" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Business Hours
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h4 className="text-xl font-semibold text-gray-900 mb-5">
                  Find Us On Map
                </h4>
                <div className="h-72 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.4527111844313!2d7.463572773996095!3d9.02240108909431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0d962b2aa833%3A0xe4b71994aa536bcb!2sRework%20academy!5e0!3m2!1sen!2sng!4v1750235694589!5m2!1sen!2sng"
                    width="100%"
                    height="100%"
                    className="border-none"
                    allowFullScreen=""
                    loading="lazy"
                    title="Company Location"
                  ></iframe>
                </div>
              </div>
            </ div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact
