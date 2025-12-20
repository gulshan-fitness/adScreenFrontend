import React from "react";
import { Link } from "react-router-dom";
import { FaBrain, FaPuzzlePiece, FaGamepad, FaRocket, FaStar, FaLightbulb } from "react-icons/fa";

export default function SSM() {
  const buttons = [
    { 
      name: "Crossword Puzzle", 
      link: "/crosswordpuzzle",
      icon: <FaPuzzlePiece className="text-xl" />,
      gradient: "from-yellow-600 to-amber-600",
      hoverGradient: "from-yellow-700 to-amber-700"
    },
    { 
      name: "Sudoku", 
      link: "/sudoko",
      icon: <FaBrain className="text-xl" />,
      gradient: "from-yellow-600 to-amber-600",
      hoverGradient: "from-yellow-700 to-amber-700"
    },
    { 
      name: "Riddles", 
      link: "/Riddles",
      icon: <FaLightbulb className="text-xl" />,
      gradient: "from-yellow-600 to-amber-600",
      hoverGradient: "from-yellow-700 to-amber-700"
    },
    { 
      name: "Matchstick Puzzle", 
      link: "/matchstickpuzzleLevels",
      icon: <FaGamepad className="text-xl" />,
      gradient: "from-yellow-600 to-amber-600",
      hoverGradient: "from-yellow-700 to-amber-700"
    },
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
            SMM Excellence Program
          </h1>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-300"></div>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl font-medium text-amber-200 mb-4 flex items-center justify-center gap-2">
          <FaRocket className="text-amber-400 animate-pulse" />
          Where Ancient Wisdom Meets Modern Science
          <FaStar className="text-amber-400 animate-pulse" />
        </p>

        {/* Main Description */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-500/20 shadow-2xl mb-12">
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-200">
            The <strong className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">SMM Academic and Competitive Excellence Training Program</strong> redefines learning for today's youth. 
            By blending <span className="text-amber-300 font-semibold">ancient wisdom</span> with{" "}
            <span className="text-yellow-300 font-semibold">modern science</span>, SMM equips students with the{" "}
            <span className="italic text-amber-300">mindset, skills, and spirit</span> to thrive academically, socially, and spiritually.
          </p>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {[
              { icon: "🧠", title: "Cognitive Development", desc: "Enhance mental agility" },
              { icon: "⚡", title: "Quick Thinking", desc: "Sharpen reflexes" },
              { icon: "🎯", title: "Strategic Mindset", desc: "Master problem-solving" }
            ].map((feature, index) => (
              <div key={index} className="bg-black/50 rounded-2xl p-4 border border-amber-500/10 hover:border-amber-500/40 transition-all duration-300 group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="font-bold text-amber-300 text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Play & Learn Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-pulse rounded-full blur-xl"></div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center gap-3">
            <FaGamepad className="text-amber-400" />
            Play & Learn
            <FaGamepad className="text-amber-400" />
          </h2>

          {/* Game Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {buttons.map((button, index) => (
              <Link
                to={button.link}
                key={index}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20 shadow-2xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
              >
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${button.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Animated Border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${button.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{ padding: '2px' }}>
                  <div className="w-full h-full bg-black rounded-2xl"></div>
                </div>

                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className={`mb-4 p-3 rounded-2xl bg-gradient-to-r ${button.gradient} text-white shadow-lg inline-flex group-hover:scale-110 transition-transform duration-300`}>
                    {button.icon}
                  </div>
                  
                  {/* Button Text */}
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-yellow-400 transition-all duration-300">
                    {button.name}
                  </h3>
                  
                  {/* Hover Arrow */}
                  <div className="text-amber-200/60 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-300 text-sm font-medium">
                    Start Playing →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { number: "50K+", label: "Active Learners", color: "text-amber-400" },
            { number: "100+", label: "Puzzle Types", color: "text-yellow-400" },
            { number: "24/7", label: "Learning Access", color: "text-amber-300" },
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