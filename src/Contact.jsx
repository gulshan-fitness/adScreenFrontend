
import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaHeadset, FaComments, FaStar } from "react-icons/fa";

export default function Contact() {
  const contactMethods = [
    { 
      name: "Email Us", 
      value: "support@smmexcellence.com",
      icon: <FaEnvelope className="text-xl" />,
      gradient: "from-yellow-600 to-amber-600",
      description: "Send us an email anytime"
    },
    { 
      name: "Call Us", 
      value: "+1 (555) 123-4567",
      icon: <FaPhone className="text-xl" />,
      gradient: "from-yellow-600 to-amber-600",
      description: "Mon-Fri, 9AM-6PM EST"
    },
    { 
      name: "Visit Us", 
      value: "123 Learning Street, Edu City",
      icon: <FaMapMarkerAlt className="text-xl" />,
      gradient: "from-yellow-600 to-amber-600",
      description: "Come say hello!"
    },
    { 
      name: "Office Hours", 
      value: "9:00 AM - 6:00 PM",
      icon: <FaClock className="text-xl" />,
      gradient: "from-yellow-600 to-amber-600",
      description: "Monday to Friday"
    },
  ];

  const supportTeams = [
    {
      name: "Technical Support",
      email: "tech@smmexcellence.com",
      icon: <FaHeadset className="text-lg" />,
      description: "Game and platform issues"
    },
    {
      name: "Academic Support",
      email: "academics@smmexcellence.com",
      icon: <FaComments className="text-lg" />,
      description: "Learning content questions"
    },
    {
      name: "General Inquiries",
      email: "info@smmexcellence.com",
      icon: <FaEnvelope className="text-lg" />,
      description: "Partnerships and general info"
    }
  ];

  return (
    <section className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Header with Animated Icons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600">
            Get In Touch
          </h1>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-300"></div>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl font-medium text-amber-200 mb-4 flex items-center justify-center gap-2">
          <FaPaperPlane className="text-amber-400 animate-pulse" />
          We'd Love to Hear From You
          <FaStar className="text-amber-400 animate-pulse" />
        </p>

        {/* Main Description */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-2xl mb-12">
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-200 mb-8">
            Have questions about our <strong className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">SMM Excellence Program</strong>? 
            Need help with a puzzle or want to share feedback? Our team is here to help you 
            <span className="text-amber-300 font-semibold"> unlock your full potential</span> and make your learning journey exceptional.
          </p>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20 shadow-2xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
              >
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${method.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Animated Border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${method.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{ padding: '2px' }}>
                  <div className="w-full h-full bg-black rounded-2xl"></div>
                </div>

                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className={`mb-4 p-3 rounded-2xl bg-gradient-to-r ${method.gradient} text-white shadow-lg inline-flex group-hover:scale-110 transition-transform duration-300`}>
                    {method.icon}
                  </div>
                  
                  {/* Method Name */}
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-yellow-400 transition-all duration-300">
                    {method.name}
                  </h3>
                  
                  {/* Method Value */}
                  <p className="text-amber-200 font-medium text-sm mb-1">
                    {method.value}
                  </p>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-xs">
                    {method.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-black/50 rounded-2xl p-8 border border-amber-500/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center gap-3">
              <FaPaperPlane className="text-amber-400" />
              Send Us a Message
              <FaPaperPlane className="text-amber-400" />
            </h2>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-amber-200 text-sm font-medium mb-2 text-left">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800/50 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-amber-200 text-sm font-medium mb-2 text-left">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full bg-gray-800/50 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-amber-200 text-sm font-medium mb-2 text-left">
                    Subject *
                  </label>
                  <select className="w-full bg-gray-800/50 border border-amber-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300">
                    <option value="">Select a subject</option>
                    <option value="technical">Technical Support</option>
                    <option value="academic">Academic Questions</option>
                    <option value="billing">Billing Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-amber-200 text-sm font-medium mb-2 text-left">
                  Message *
                </label>
                <textarea
                  rows="8"
                  className="w-full bg-gray-800/50 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
                
                <button
                  type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25"
                >
                  <FaPaperPlane className="inline mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Support Teams Section */}
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center gap-3">
            <FaHeadset className="text-amber-400" />
            Specialized Support Teams
            <FaHeadset className="text-amber-400" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {supportTeams.map((team, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20 shadow-2xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
              >
                <div className="text-center">
                  <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg inline-flex group-hover:scale-110 transition-transform duration-300">
                    {team.icon}
                  </div>
                  
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-yellow-400 transition-all duration-300">
                    {team.name}
                  </h3>
                  
                  <p className="text-amber-200 font-medium text-sm mb-2">
                    {team.email}
                  </p>
                  
                  <p className="text-gray-400 text-xs">
                    {team.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Time Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { number: "< 24h", label: "Average Response Time", color: "text-amber-400" },
            { number: "98%", label: "Customer Satisfaction", color: "text-yellow-400" },
            { number: "24/7", label: "Technical Support", color: "text-amber-300" },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 border border-amber-500/20">
              <div className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.number}</div>
              <div className="text-sm text-amber-200/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-amber-400/30 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-400/30 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-amber-400/30 rounded-full animate-bounce delay-300"></div>
      <div className="absolute bottom-20 right-10 w-3 h-3 bg-yellow-400/30 rounded-full animate-bounce delay-500"></div>
    </section>
  );
}