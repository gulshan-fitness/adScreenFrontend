import React, { useContext, useEffect, useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaTv, 
  FaRulerCombined, 
  FaPlay,
  FaCalendarAlt, 
  FaStar, 
  FaBuilding,
  FaDesktop,
  FaMobileAlt,
  FaRegClock,
  FaEye,
  FaHeart,
  FaShare,
  FaChevronRight,
  FaVideo,
  FaFilm,
  FaBroadcastTower
} from 'react-icons/fa';
import { MdLocationOn, MdScreenRotation, MdHighQuality, MdAccessTime } from 'react-icons/md';
import { IoIosSpeedometer } from 'react-icons/io';
import { BsFillLightningFill } from 'react-icons/bs';
import { Context } from '../Context_holder';
import { Link } from 'react-router-dom';

const AdScreenList = () => {
    const { user, usertoken, FetchApi } = useContext(Context);
    const [screens, setScreens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (!user || !usertoken) return;
        setLoading(true);

        FetchApi(null, import.meta.env.VITE_USER_URL, "getownerscreen", user?._id, null, null, usertoken)
            .then((res) => {
                setScreens(res);
                setLoading(false);
            })
            .catch((err) => {
                setScreens([]);
                setLoading(false);
                notify('Failed to load screens', 0);
            });
    }, [user, usertoken]);

    const toggleFavorite = (screenId) => {
        setFavorites(prev => 
            prev.includes(screenId) 
                ? prev.filter(id => id !== screenId)
                : [...prev, screenId]
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto absolute top-4 left-4"></div>
                    </div>
                    <p className="text-gray-400 text-lg mt-4 animate-pulse">Loading premium screens...</p>
                </div>
            </div>
        );
    }

    if (screens.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaTv className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No Screens Available</h3>
                    <p className="text-gray-400 mb-8">No advertising screens are currently available for content playback.</p>
                    <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                        Request New Screen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Screen Network
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base mt-1">
                                Play content on premium digital displays
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-300 text-sm sm:text-base">
                                <span className="hidden sm:inline">Filter</span>
                                <span className="sm:hidden">Filter</span>
                            </button>
                            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                                Add Content
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Screens</p>
                                <p className="text-2xl font-bold text-white mt-1">{screens.length}</p>
                            </div>
                            <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                                <FaTv className="w-5 h-5 text-indigo-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Active</p>
                                <p className="text-2xl font-bold text-white mt-1">
                                    {screens.filter(s => s.status).length}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                                <BsFillLightningFill className="w-5 h-5 text-green-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Avg. Rating</p>
                                <p className="text-2xl font-bold text-white mt-1">
                                    {(screens.reduce((acc, s) => acc + s.rating, 0) / screens.length).toFixed(1)}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                                <FaStar className="w-5 h-5 text-yellow-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Available</p>
                                <p className="text-2xl font-bold text-white mt-1">
                                    {screens.filter(s => s.status).length}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                <FaPlay className="w-5 h-5 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Screens Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {screens.map((screen) => (
                        <div
                            key={screen._id}
                            className="group relative bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 transform hover:-translate-y-2 shadow-2xl hover:shadow-3xl"
                        >
                            {/* Image/Video Preview */}
                            <div className="relative h-48 sm:h-56 overflow-hidden">
                                {screen.image ? (
                                    <>
                                        <img
                                            src={screen.image}
                                            alt={screen.screenName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-pink-900/30 flex items-center justify-center">
                                        <div className="relative">
                                            <FaTv className="w-20 h-20 text-gray-400/30" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <FaVideo className="w-8 h-8 text-gray-400/50" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Status Badge */}
                                <div className="absolute top-4 left-4">
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                                        screen.status 
                                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${screen.status ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                                        <span className="text-xs font-semibold">{screen.status ? 'LIVE' : 'OFFLINE'}</span>
                                    </div>
                                </div>

                                {/* Favorite Button */}
                                <button 
                                    onClick={() => toggleFavorite(screen._id)}
                                    className="absolute top-4 right-4 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-300"
                                >
                                    <FaHeart className={`w-4 h-4 transition-colors duration-300 ${
                                        favorites.includes(screen._id) 
                                            ? 'text-red-500 fill-red-500' 
                                            : 'text-gray-300 hover:text-red-400'
                                    }`} />
                                </button>

                                {/* Play Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                        <FaPlay className="w-6 h-6 text-white ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-4">
                                {/* Title and Rating */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white line-clamp-1">{screen.screenName}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar 
                                                        key={i} 
                                                        className={`w-3 h-3 ${
                                                            i < Math.floor(screen.rating) 
                                                                ? 'text-yellow-400 fill-yellow-400' 
                                                                : 'text-gray-600'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400">{screen.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                                            <FaEye className="w-3.5 h-3.5" />
                                            <span>{Math.floor(Math.random() * 1000)}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">views/day</div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <FaMapMarkerAlt className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    <span className="line-clamp-1">
                                        {screen.address.street && `${screen.address.street}, `}
                                        {screen.address.city}
                                    </span>
                                </div>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaDesktop className="w-3.5 h-3.5 text-indigo-400" />
                                            <span className="text-xs text-gray-400">Resolution</span>
                                        </div>
                                        <p className="text-white font-semibold text-sm">
                                            {screen.resolution.width}×{screen.resolution.height}
                                        </p>
                                    </div>

                                    <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaRulerCombined className="w-3.5 h-3.5 text-green-400" />
                                            <span className="text-xs text-gray-400">Size</span>
                                        </div>
                                        <p className="text-white font-semibold text-sm">{screen.size.diagonal}"</p>
                                    </div>

                                    <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MdScreenRotation className="w-4 h-4 text-purple-400" />
                                            <span className="text-xs text-gray-400">Orientation</span>
                                        </div>
                                        <p className="text-white font-semibold text-sm capitalize">{screen.orientation}</p>
                                    </div>

                                    <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaBuilding className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="text-xs text-gray-400">Type</span>
                                        </div>
                                        <p className="text-white font-semibold text-sm capitalize">
                                            {screen.locationType?.replace('_', ' ') || 'Unknown'}
                                        </p>
                                    </div>
                                </div>

                                {/* Play Button */}
                                <Link
                                to={`/adscreen/${screen?._id}`}
                                 
                                    disabled={!screen.status}
                                    className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 group/btn ${
                                        screen.status
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl'
                                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {screen.status ? (
                                        <>
                                            <FaPlay className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                                            <span>Play Content</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaRegClock className="w-4 h-4" />
                                            <span>Unavailable</span>
                                        </>
                                    )}
                                </Link>

                                {/* Quick Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
                                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                        <FaShare className="w-4 h-4" />
                                        <span className="hidden sm:inline">Share</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                        <FaCalendarAlt className="w-4 h-4" />
                                        <span className="hidden sm:inline">Schedule</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                                        <FaChevronRight className="w-4 h-4" />
                                        <span className="hidden sm:inline">Details</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Floating Action Button for Mobile */}
            <button className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50">
                <FaPlay className="w-6 h-6 text-white ml-1" />
            </button>
        </div>
    );
};

export default AdScreenList;