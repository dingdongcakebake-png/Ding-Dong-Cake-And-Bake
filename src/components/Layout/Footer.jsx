import { Heart, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import logo from '../../assects/logo.png'; 

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white mt-16 transition-colors">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
              <h3 className="text-2xl font-bold text-amber-500">
                DingDong Cake & Bake
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Crafting delicious memories with premium quality cakes, pastries, and baked goods.
              Made with love, delivered with care.
            </p>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Heart className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm">Made with love since 2020</span>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-amber-500 hover:text-white transition"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-amber-500 hover:text-white transition"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-amber-500 hover:text-white transition"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-500">Contact Us</h4>

            <div className="space-y-3 text-sm">

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  245, Gandhi Nagar Rd, Pungavadiputhur, Gandhi Nagar, Tamil Nadu 636102, India
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  +91 73730 42268
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  dingdongcakebake@gmail.com
                </span>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <a
                  href="https://wa.me/917373042268"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition"
                >
                  Chat on WhatsApp
                </a>
              </div>

            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-500">Business Hours</h4>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Monday - Sunday</span>
                <span>10:00 AM - 9:00 PM</span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                * Self-pickup available during business hours
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                * Cash on Delivery for home delivery orders
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © 2024 DingDong Cake & Bake. All rights reserved.
          </p>

          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 md:mt-0">
            Crafted with ❤️ for cake lovers
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
