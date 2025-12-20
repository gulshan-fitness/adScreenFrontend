import React, { useContext, useEffect, useState } from "react";
import { FaUserGraduate, FaPuzzlePiece } from "react-icons/fa";
import { MdFunctions } from "react-icons/md";
import { Context } from "../Context_holder";
import { Link } from "react-router-dom";
import Top10StudentsChart from "./Top10StudentsChart";

export default function Dashboard() {
  const {
    CrosswordPuzzleFetch,
    UsersFetch,
    UsersList,
    AllCrosswordPuzzle,
    SudokoFetch,
    AllSudoko,
    AllRiddles,
    RiddlesFetch,
    MatchistickPuzzleFetch,
    AllMatchistickPuzzles
  } = useContext(Context);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          UsersFetch(),
          CrosswordPuzzleFetch(),
          SudokoFetch(),
          RiddlesFetch(),
          MatchistickPuzzleFetch()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { 
      title: "Total Students", 
      value: UsersList?.length || 0, 
      icon: <FaUserGraduate />, 
      Path: "/adminprofile/usersList" 
    },
    { 
      title: "Total Crossword Puzzles", 
      value: AllCrosswordPuzzle?.length || 0, 
      icon: <FaPuzzlePiece />,
      Path: "/adminprofile/crosswordpuzzle/view" 
    },
    { 
      title: "Total Sudoku Puzzles", 
      value: AllSudoko?.length || 0, 
      icon: <MdFunctions />, 
      Path: "/adminprofile/sudoko/view"
    },
    { 
      title: "Total Riddles", 
      value: AllRiddles?.length || 0, 
      icon: <MdFunctions />, 
      Path: "/adminprofile/Riddles/view"
    },
    { 
      title: "Total Matchstick Puzzles", 
      value: AllMatchistickPuzzles?.length || 0, 
      icon: <MdFunctions />, 
      Path: "/adminprofile/matchstickpuzzle/view"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] p-6 md:p-12 text-[#F5DEB3] font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden z-30"
          onClick={toggleSidebar}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FFD700] mb-2">Admin Dashboard</h1>
          <p className="text-[#F5DEB3] opacity-80">Welcome to your management dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link 
              key={index} 
              to={stat.Path} 
              className="block"
            >
              <div className="bg-[#1A1A1A] p-6 border-[#b8860b]/40 backdrop-blur-md bg-black/70 shadow-[0_8px_24px_rgba(184,134,11,0.4)] rounded-3xl border border-[#333333] transition-all hover:scale-105 hover:shadow-[0_12px_32px_rgba(184,134,11,0.6)] cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="text-3xl text-[#FFD700] group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#F5DEB3] opacity-80 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-[#FFD700]">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-xs text-[#FFD700] opacity-70 group-hover:opacity-100 transition-opacity">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Top Students Chart Section */}
        <div className="bg-[#1A1A1A] px-2 py-7 border-[#b8860b]/40 backdrop-blur-md bg-black/70 shadow-[0_8px_24px_rgba(184,134,11,0.4)] rounded-3xl border border-[#333333]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-2">Top Students Performance</h2>
            <p className="text-[#F5DEB3] opacity-80">Leaderboard of highest performing students</p>
          </div>
          <Top10StudentsChart />
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 text-center">
          <p className="text-[#F5DEB3] opacity-70">
            Manage your platform efficiently with real-time insights and analytics
          </p>
        </div>
      </div>
    </div>
  );
}