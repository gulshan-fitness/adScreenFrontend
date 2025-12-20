import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer(){

  return (

    <footer className="w-full bg-black text-[#F6FFFA] pt-10 pb-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-[#FFD700]">MyApp</h2>
          <p className="text-sm sm:text-base opacity-90">
            Empowering your journey with smart solutions and a human touch.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg sm:text-xl text-[#FFD700] mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm sm:text-base">
            <li>
              <Link to="/" className="hover:text-white transition duration-150">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition duration-150">About</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition duration-150">Services</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition duration-150">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg sm:text-xl text-[#FFD700] mb-4">Contact</h3>
          <ul className="space-y-2 text-sm sm:text-base">
            <li>Email: gulshankumarjangid@gmail.com</li>
            <li>Phone: +918058949490</li>
            <li>Location: India</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold text-lg sm:text-xl text-[#FFD700] mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-xl sm:text-2xl">
            <Link to="#" className="hover:text-white transition"><FaFacebookF /></Link>
            <Link to="#" className="hover:text-white transition"><FaTwitter /></Link>
            <Link to="#" className="hover:text-white transition"><FaInstagram /></Link>
            <Link to="#" className="hover:text-white transition"><FaLinkedinIn /></Link>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-xs sm:text-sm border-t border-[#F6FFFA]/10 pt-4">
        © {new Date().getFullYear()} <span className="text-[#FFD700] font-medium">MyApp</span>. All rights reserved.
      </div>
    </footer>

    
  );

}
