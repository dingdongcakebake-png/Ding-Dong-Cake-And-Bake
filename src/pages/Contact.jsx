import { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import api from '../services/api';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    enquiryType: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      await api.post('/enquiries', form);
      setSuccess('✅ Enquiry sent successfully! We will contact you soon.');

      setForm({
        name: '',
        phone: '',
        email: '',
        enquiryType: '',
        message: ''
      });
    } catch (error) {
  console.log("AXIOS ERROR:", error);
  console.log("RESPONSE:", error.response);
  setSuccess(
    '❌ ' + (error.response?.data?.message || error.message || 'Server not reachable')
  );
}

     finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 transition-colors">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question or need a custom cake? We’d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div className="space-y-6">

            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
              <Phone className="text-amber-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                <p className="text-gray-600 dark:text-gray-400">+91 73730 42268</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
              <Mail className="text-amber-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                <p className="text-gray-600 dark:text-gray-400">
                  dingdongcakebake@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
              <MapPin className="text-amber-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Address</p>
                <p className="text-gray-600 dark:text-gray-400">
                  245, Gandhi Nagar Rd, Pungavadiputhur, Gandhi Nagar, Tamil Nadu 636102, India
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
              <MessageCircle className="text-green-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">WhatsApp</p>
                <a
                  href="https://wa.me/917373042268"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-400 hover:underline"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">

            {success && (
              <div className="mb-4 text-green-600 dark:text-green-400 font-medium">
                {success}
              </div>
            )}

            <form onSubmit={submitForm} className="space-y-5">

              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Name</label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your phone"
                  className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Enquiry Type</label>
                <select
                  name="enquiryType"
                  required
                  value={form.enquiryType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900"
                >
                  <option value="">Select enquiry type</option>
                  <option value="custom_cake">Custom Cake</option>
                  <option value="products">Products</option>
                  <option value="delivery">Delivery</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Your message"
                  className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
