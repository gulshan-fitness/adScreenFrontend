

import React from "react";
import { FaBrain, FaRocket, FaStar, FaAward, FaUsers, FaGraduationCap, FaLightbulb, FaChartLine, FaGlobe, FaHeart, FaInfinity, FaShieldAlt, FaLock, FaCrown, FaGem } from "react-icons/fa";

export default function About() {
  const coreValues = [
    {
      icon: <FaBrain className="text-2xl" />,
      title: "Cognitive Excellence",
      description: "Developing razor-sharp mental agility and problem-solving capabilities through scientifically-backed methodologies.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaRocket className="text-2xl" />,
      title: "Accelerated Growth",
      description: "Propelling learners beyond traditional boundaries with innovative, results-driven educational frameworks.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaLock className="text-2xl" />,
      title: "Character Building",
      description: "Cultivating integrity, resilience, and ethical leadership alongside academic excellence.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <FaInfinity className="text-2xl" />,
      title: "Lifelong Learning",
      description: "Instilling a passion for continuous growth and adaptation in an ever-evolving world.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const milestones = [
    { year: "2018", title: "Foundation", description: "SMM Excellence Program launched with vision to revolutionize education" },
    { year: "2020", title: "Global Reach", description: "Expanded to 50+ countries with 100K+ active learners" },
    { year: "2022", title: "AI Integration", description: "Incorporated advanced AI for personalized learning paths" },
    { year: "2024", title: "Excellence Redefined", description: "Pioneering next-generation cognitive development tools" }
  ];

  const teamStats = [
    { number: "50+", label: "Expert Educators", suffix: "Years Combined Experience" },
    { number: "15", label: "Cognitive Scientists", suffix: "Research Publications" },
    { number: "25+", label: "Countries", suffix: "Global Team Presence" },
    { number: "99.2%", label: "Success Rate", suffix: "Student Satisfaction" }
  ];

  const features = [
    {
      icon: "⚡",
      title: "Neuro-Adaptive Learning",
      description: "AI-powered systems that adapt to individual learning patterns"
    },
    {
      icon: "🎯",
      title: "Precision Analytics",
      description: "Real-time performance tracking with actionable insights"
    },
    {
      icon: "🌍",
      title: "Global Community",
      description: "Connect with learners and mentors worldwide"
    },
    {
      icon: "🔬",
      title: "Evidence-Based",
      description: "Methods validated by cognitive science research"
    }
  ];

  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-amber-600/15 to-yellow-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-amber-400/10 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-40 left-32 w-24 h-24 border border-blue-400/10 rotate-12 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-purple-400/10 rotate-90 animate-pulse delay-300"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-amber-400/40 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-float delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-full px-6 py-3 mb-8 backdrop-blur-xl">
              <FaAward className="text-amber-400 text-lg" />
              <span className="text-amber-200 font-semibold text-sm uppercase tracking-wider">World-Class Education Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600">
                Redefining
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                Excellence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Where <span className="text-amber-400 font-semibold">Ancient Wisdom</span> meets{" "}
              <span className="text-blue-400 font-semibold">Modern Science</span> to create the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">
                Ultimate Learning Experience
              </span>
            </p>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              {teamStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:scale-105">
                    <div className="text-3xl lg:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-amber-200 font-semibold text-sm mb-1">{stat.label}</div>
                    <div className="text-gray-400 text-xs">{stat.suffix}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Mission Content */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center">
                    <FaStar className="text-white text-xl" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
                    Our Mission
                  </h2>
                </div>
                
                <p className="text-xl text-gray-300 leading-relaxed">
                  To <span className="text-amber-400 font-semibold">empower every learner</span> with the cognitive tools, 
                  strategic mindset, and spiritual foundation needed to excel in academics, 
                  thrive in competitive environments, and lead with purpose in an increasingly complex world.
                </p>

                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-200 text-lg">{feature.title}</h3>
                        <p className="text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vision Card */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/20 shadow-2xl">
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <FaLightbulb className="text-white text-sm" />
                  </div>
                  
                  <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                    Our Vision
                  </h3>
                  
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    A world where every individual has access to transformative education that 
                    nurtures both intellectual prowess and human values, creating leaders who 
                    shape a better future for all.
                  </p>
                  
                  <div className="flex items-center gap-2 text-amber-400">
                    <FaHeart className="animate-pulse" />
                    <span className="font-semibold">Building Tomorrow's Leaders Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
                Core Values
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                The foundational principles that guide our mission and define our impact
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/5 hover:border-white/20 transition-all duration-500 hover:scale-105"
                >
                  {/* Animated Gradient Border */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{ padding: '2px' }}>
                    <div className="w-full h-full bg-black rounded-3xl"></div>
                  </div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-r ${value.gradient} text-white shadow-2xl inline-flex group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-yellow-400 transition-all duration-300">
                      {value.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 mb-4">
                Our Journey
              </h2>
              <p className="text-xl text-gray-400">Milestones in educational innovation</p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-500 to-purple-500"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Content */}
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-amber-500/30 transition-all duration-500 group hover:scale-105">
                        <div className="text-amber-400 font-black text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                        <p className="text-gray-400">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full border-4 border-black shadow-2xl"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-12 border border-amber-500/20 shadow-2xl">
              <h2 className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400 mb-6">
                Join the Excellence Movement
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Be part of a global community dedicated to pushing the boundaries of 
                human potential and creating a brighter future through education.
              </p>
              <button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-amber-500/25 text-lg">
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}