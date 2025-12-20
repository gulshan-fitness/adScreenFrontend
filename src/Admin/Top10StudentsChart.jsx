import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Context } from '../Context_holder';
import {
  FaTrophy,
  FaUsers,
  FaChartLine,
  FaCrown,
  FaStar,
  FaMedal,
} from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* ------------------------------------------------------------------ */
/* Premium Gradient Colors */
const GRADIENT_COLORS = [
  'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)',
  'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
  'linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%)',
  'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
  'linear-gradient(135deg, #45B7D1 0%, #96C93D 100%)',
  'linear-gradient(135deg, #FFA07A 0%, #FF7F50 100%)',
  'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
  'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
  'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
];

export default function Top10StudentsChart() {
  const { Top10StudentsFetch, Top10Users } = useContext(Context);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  
  // Pure JS refs — no TypeScript
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  /* --------------------------------------------------------------- */
  /* Fetch data */
  useEffect(() => {
    Top10StudentsFetch();
  }, []);

  /* --------------------------------------------------------------- */
  /* Build chart data + gradients */
  useEffect(() => {
    if (!Top10Users?.length || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const labels = Top10Users.map((s) => {
      const first = s.name.split(' ')[0];
      if (window.innerWidth < 480) return first.length > 5 ? `${first.slice(0, 4)}…` : first;
      if (window.innerWidth < 768) return first.length > 8 ? `${first.slice(0, 7)}…` : first;
      return first;
    });

    const dataValues = Top10Users.map((s) => s.totalScore);

    const backgroundColors = Top10Users.map((_, i) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      const stops = GRADIENT_COLORS[i % GRADIENT_COLORS.length].match(/#[A-Fa-f0-9]{6}/g) || [];
      gradient.addColorStop(0, stops[0] || '#fff');
      gradient.addColorStop(1, stops[1] || stops[0] || '#fff');
      return gradient;
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Score',
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 2,
          borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 4, bottomRight: 4 },
          borderSkipped: false,
          barThickness: 28,
          maxBarThickness: 48,
          categoryPercentage: 0.8,
          barPercentage: 0.9,
        },
      ],
    });
  }, [Top10Users]);

  /* --------------------------------------------------------------- */
  /* Loading UI */
  if (!Top10Users?.length) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0f3460] flex items-center justify-center p-4 rounded-3xl">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-t-[#FFD700] border-r-[#C0C0C0] border-b-[#CD7F32] border-l-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#FFD700] font-semibold text-base">Loading Leaderboard…</p>
          <p className="text-gray-400 mt-1 text-xs">Fetching top performers data</p>
        </div>
      </div>
    );
  }

  const maxScore = Math.max(...Top10Users.map((s) => s.totalScore), 10);
  const avgScore = (Top10Users.reduce((a, s) => a + s.totalScore, 0) / Top10Users.length).toFixed(1);

  /* --------------------------------------------------------------- */
  /* Chart options – fully responsive */
  const options = {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1800, easing: 'easeOutElastic' },
    layout: { padding: { top: 16, right: 8, bottom: 8, left: 8 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#FFD700',
        bodyColor: '#E2E8F0',
        borderColor: '#FFD700',
        borderWidth: 2,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        callbacks: {
          title: (items) => {
            const i = items[0].dataIndex;
            return `${Top10Users[i].rank}. ${Top10Users[i].name}`;
          },
          label: (ctx) => `Score: ${ctx.parsed.y} pts`,
          afterLabel: (ctx) => `Email: ${Top10Users[ctx.dataIndex].email}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.08)', drawBorder: false, lineWidth: 1 },
        ticks: {
          color: '#94A3B8',
          font: { size: 10 },
          padding: 4,
          callback: (v) => `${v} pts`,
        },
        border: { dash: [4, 4] },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#E2E8F0',
          font: { size: 9 },
          padding: 6,
        },
      },
    },
    interaction: { mode: 'index', intersect: false },
  };

  /* --------------------------------------------------------------- */
  /* Render */
  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl border border-gray-700/50 shadow-2xl">
      {/* Header */}

      
      <header className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
          <FaCrown className="text-lg sm:text-2xl text-yellow-400 animate-pulse" />
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500">
            Top Performers Leaderboard
          </h1>
          <FaCrown className="text-lg sm:text-2xl text-yellow-400 animate-pulse" />
        </div>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
          Celebrating excellence across all puzzle games
        </p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {[
          { label: 'Champions', value: Top10Users.length, icon: <FaUsers className="text-lg sm:text-xl" />, gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Highest', value: maxScore, icon: <FaTrophy className="text-lg sm:text-xl" />, gradient: 'from-yellow-500 to-orange-500' },
          { label: 'Average', value: avgScore, icon: <FaChartLine className="text-lg sm:text-xl" />, gradient: 'from-green-500 to-emerald-500' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 shadow-md hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 font-medium">{stat.label}</div>
              </div>
              <div className={`p-2 rounded-md bg-gradient-to-r ${stat.gradient} text-white shadow-sm`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Chart */}
        <article className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Performance Chart
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FaStar className="text-yellow-400" />
              <span>Scores</span>
            </div>
          </div>

          <div className="relative h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 xl:h-[420px]">
            <canvas ref={canvasRef} className="hidden" />
            <Bar ref={chartRef} data={chartData} options={options} className="w-full h-full" />
          </div>
        </article>

        {/* Leaderboard List */}
        <article className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Top Performers
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <FaMedal className="text-yellow-400" />
              <span>Rankings</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
            {Top10Users.map((s, idx) => {
              const medalCfg = [
                { bg: 'from-yellow-500/30 to-amber-600/30', border: 'border-yellow-400/50', medal: '1st', txt: 'text-black' },
                { bg: 'from-gray-400/30 to-gray-600/30', border: 'border-gray-400/50', medal: '2nd', txt: 'text-black' },
                { bg: 'from-orange-600/30 to-amber-700/30', border: 'border-orange-500/50', medal: '3rd', txt: 'text-white' },
              ];
              const cfg = idx < 3 ? medalCfg[idx] : { bg: 'from-slate-700/20 to-slate-800/20', border: 'border-slate-600/30', medal: `${idx + 1}`, txt: 'text-white' };

              return (
                <div
                  key={s._id}
                  className={`p-2.5 sm:p-3 rounded-lg bg-gradient-to-r ${cfg.bg} border ${cfg.border} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-white/60 group`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xs sm:text-sm font-black shadow-sm ${
                          idx === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black'
                            : idx === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black'
                            : idx === 2
                            ? 'bg-gradient-to-br from-orange-400 to-amber-600 text-white'
                            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                        }`}
                      >
                        {cfg.medal}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm truncate group-hover:text-cyan-200 transition-colors">
                          {s.name}
                        </h4>
                        <p className="text-xs text-gray-300 truncate">{s.email}</p>
                        <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded-full bg-black/30 text-cyan-300 border border-cyan-500/30">
                          #{s.rank}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
                        {s.totalScore}
                      </div>
                      <div className="text-xs text-gray-400">pts</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #FFA500, #FF6B00);
        }
      `}</style>
    </div>
  );
}