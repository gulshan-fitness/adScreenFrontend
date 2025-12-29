import React, { useState, useRef, useEffect } from 'react';
import { useContext } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaRupeeSign, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaPlayCircle,
  FaHourglassHalf,
  FaExclamationCircle,
  FaEye,
  FaDownload,
  FaCreditCard,
  FaMobileAlt,
  FaFilter,
  FaSearch,
  FaSort,
  FaVideo,
  FaImage,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
  FaQrcode,
  FaExternalLinkAlt,
  FaFile,
  FaCaretDown,
  FaInfoCircle,
  FaChartLine,
  FaSpinner
} from 'react-icons/fa';
import { MdLocationOn, MdScreenShare } from 'react-icons/md';
import { Context } from '../Context_holder';
import axios from 'axios';
import { socket } from '../../Socket';
import AdSlotPayment from '../Payment/AdSlotPayment';
import Loader from '../ReusedComponents/Loader';

const BookingList = () => {
  const { usertoken, user, FetchApi ,notify,bookingDeleteHandler,getCurrencySymbol} = useContext(Context);
  const [step,setstep] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [mediaShow,setmediaShow]= useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [mediaCurrentTime, setMediaCurrentTime] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
    const [DeleteLoader, setDeleteLoader] = useState(false); 




const DeleteHandler=async(id,files)=>{
  if(!user|| !usertoken) return
setDeleteLoader(true)
 const res =await bookingDeleteHandler(id,files)
 if(res?.status==1){
     getBooking(user, usertoken);
     setDeleteLoader(false)
 }


}

  const videoRef = useRef(null);
  const mediaContainerRef = useRef(null);
 



useEffect(() => {
  if (!user?._id || user?.role !== "advertiser") return;

  // Connect only if not already connected
  if (!socket.connected) {
    socket.connect();
  }

  const onConnect = () => {
    console.log("Socket connected by advertiser:", socket.id);
    socket.emit("JoinAdvertiserRoom", user._id);
  };

  const onBookingUpdate = (data) => {
    setBookings((prev) => {
      const index = prev.findIndex(item => item?._id === data?._id);
      if (index === -1) return prev;

      const updated = [...prev];
      updated[index] = data;
      return updated;
    });

    console.log("Booking update:", data);
  };

  const onDisconnect = () => {
    console.log("Socket disconnected");
  };

  socket.on("connect", onConnect);
  socket.on("BookingUpdate", onBookingUpdate);
  socket.on("disconnect", onDisconnect);

  return () => {
    socket.off("connect", onConnect);
    socket.off("BookingUpdate", onBookingUpdate);
    socket.off("disconnect", onDisconnect);

    // ❌ DO NOT disconnect here
  };
}, [user?._id]);


useEffect(() => {
  if (!user?._id || user?.role !== "screen_owner") return;

  // Connect only if not already connected

  if (!socket.connected) {
    socket.connect();
  }

  const onConnect = () => {
    console.log("Socket connected by owner:",socket.id);
    socket.emit("JoinScreenOwnerRoom",user._id);
  };

  const onBookingUpdate = (data) => {
    setBookings((prev) => {
    

      const updated = [...prev,data];
    
      return updated;
    });

    console.log("Booking update:", data);
  };

  const onDisconnect = () => {
    console.log("Socket disconnected");
  };

  socket.on("connect", onConnect);
  socket.on("BookingUpdate", onBookingUpdate);
  socket.on("disconnect", onDisconnect);

  return () => {
    socket.off("connect", onConnect);
    socket.off("BookingUpdate", onBookingUpdate);
    socket.off("disconnect", onDisconnect);

    // ❌ DO NOT disconnect here
  };
}, [user?._id]);


  const getBooking = (user, usertoken) => {
    setLoading(true); // Start loading
    FetchApi(null, import.meta.env.VITE_USER_URL, "getbookings", `${user?.role == "advertiser" ? `${user?._id}/null` : `null/${user?._id}`}`, null, null, usertoken)
      .then((res) => {
        setBookings(res);
        setLoading(false); // Stop loading on success
      })
      .catch((err) => {
        setBookings([]);
        setLoading(false); // Stop loading on error
        console.error("Error fetching bookings:", err);
      });
  }
  

  useEffect(() => {
    if (!user || !usertoken) return;
    getBooking(user, usertoken);
  }, [user, usertoken,step]);



const payHandler=(bookingData)=>{
setstep(false)
 setSelectedBooking(bookingData);



}



  // Filter bookings based on status
  const filteredBookings = bookings.filter(booking => {
    if (filter !== 'all' && booking.booking_status !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        booking.advertiser_name?.toLowerCase().includes(term) ||
        booking.screen_name?.toLowerCase().includes(term) ||
        booking.location?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  // Status configuration
const statusConfig = {
  pending: {
    color: 'bg-amber-500',
    icon: <FaHourglassHalf />,
    label: 'Pending'
  },
  confirmed: {
    color: 'bg-emerald-500',
    icon: <FaCheckCircle />,
    label: 'Confirmed'
  },
  cancelled: {
    color: 'bg-rose-500',
    icon: <FaTimesCircle />,
    label: 'Cancelled'
  },
  playing: {
    color: 'bg-blue-500',
    icon: <FaPlayCircle />,
    label: 'Live Now'
  },
  completed: {
    color: 'bg-slate-500',
    icon: <FaCheckCircle />,
    label: 'Completed'
  },
  expired: {
    color: 'bg-slate-600',
    icon: <FaExclamationCircle />,
    label: 'Expired'
  },
  rejected: {
    color: 'bg-red-600',
    icon: <FaTimesCircle />,
    label: 'Rejected'
  }
};

  // Payment status configuration
  const paymentConfig = {
    pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Payment Pending' },
    paid: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Paid' },
    failed: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Payment Failed' },
    refunded: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Refunded' }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setCurrentMediaIndex(0);
    setmediaShow(true)
    setIsPlaying(true);
  };

  const closeDetails = () => {
    setSelectedBooking(null);
    setmediaShow(false)
    setCurrentMediaIndex(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const nextMedia = () => {
    if (selectedBooking && selectedBooking.adfiles) {
      setCurrentMediaIndex((prevIndex) =>
        prevIndex === selectedBooking.adfiles.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevMedia = () => {
    if (selectedBooking && selectedBooking.adfiles) {
      setCurrentMediaIndex((prevIndex) =>
        prevIndex === 0 ? selectedBooking.adfiles.length - 1 : prevIndex - 1
      );
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && mediaContainerRef.current) {
      mediaContainerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * mediaDuration;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTimeOnly = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Media progress tracking
  useEffect(() => {
    if (selectedBooking && selectedBooking.adfiles) {
      const mediaUrl = selectedBooking.adfiles[currentMediaIndex];
      const ext = mediaUrl?.split(".").pop()?.toLowerCase();
      const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext);

      if (isVideo && videoRef.current) {
        const video = videoRef.current;

        const updateProgress = () => {
          setMediaCurrentTime(video.currentTime);
          setMediaDuration(video.duration || 0);
          setMediaProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
        };

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', () => {
          setMediaDuration(video.duration);
        });

        if (isPlaying) {
          video.play().catch(e => console.log("Auto-play prevented:", e));
        }

        return () => {
          video.removeEventListener('timeupdate', updateProgress);
        };
      } else if (!isVideo) {
        // Auto-advance images after 5 seconds
        const timer = setTimeout(() => {
          if (selectedBooking.adfiles.length > 1) {
            nextMedia();
          }
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [currentMediaIndex, selectedBooking, isPlaying]);

  const UpdateHandler = async (id, status,path) => {
    if (!usertoken) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}${path}/${id}/${status}`, {},
        {
          headers: {
            Authorization: usertoken
          }
        }
      );

      const { data } = response;
      notify(data.msg, data.status);

      if (data.status === 1 && user && usertoken) {
        getBooking(user, usertoken);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save AdScreen';
      notify(errorMessage, 0);
    }
  };

  // Loading Component
  const LoadingSpinner = () => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm">
      <div className="relative">
        <FaSpinner className="h-16 w-16 animate-spin text-blue-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-transparent border-t-blue-300 animate-spin" />
        </div>
      </div>
      <p className="mt-6 text-lg font-medium text-white">Loading Bookings...</p>
      <p className="mt-2 text-sm text-gray-400">Please wait while we fetch your bookings</p>
    </div>
  );

  // Loading Skeleton for Stats Cards
  const StatsSkeleton = () => (
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="h-7 w-12 animate-pulse rounded-lg bg-gray-700"></div>
          <div className="mt-2 h-4 w-16 animate-pulse rounded bg-gray-800"></div>
        </div>
      ))}
    </div>
  );

  // Loading Skeleton for Booking Cards
  const BookingCardsSkeleton = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-950/50 p-4 backdrop-blur-sm">
          {/* Skeleton header */}
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-800"></div>
                <div className="mt-2 h-7 w-24 animate-pulse rounded-full bg-gray-800"></div>
              </div>
              <div className="h-6 w-24 animate-pulse rounded-full bg-gray-800"></div>
            </div>

            {/* Skeleton content */}
            <div className="mt-4">
              <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-gray-800"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-800"></div>
                    <div className="flex-1">
                      <div className="h-3 w-16 animate-pulse rounded bg-gray-800"></div>
                      <div className="mt-1 h-4 w-32 animate-pulse rounded bg-gray-800"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-3">
                <div>
                  <div className="h-3 w-12 animate-pulse rounded bg-gray-800"></div>
                  <div className="mt-1 h-7 w-20 animate-pulse rounded bg-gray-800"></div>
                </div>
                <div>
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-800"></div>
                  <div className="mt-1 h-4 w-20 animate-pulse rounded bg-gray-800"></div>
                </div>
              </div>
            </div>

            {/* Skeleton buttons */}
            <div className="mt-6 flex gap-2">
              <div className="flex-1 h-10 animate-pulse rounded-lg bg-gray-800"></div>
              <div className="w-20 h-10 animate-pulse rounded-lg bg-gray-800"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
<>
{step ?
( <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 p-3 md:p-6 relative">
      {/* Loading Overlay */}
      {loading && <LoadingSpinner />}

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white">
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              Slot Bookings
              {loading && (
                <FaSpinner className="ml-2 animate-spin text-blue-400 text-lg" />
              )}
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {loading ? "Fetching your bookings..." : "Manage and track your advertising slot bookings"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 md:flex">
              <FaChartLine />
              Analytics
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-gray-800">
              <FaDownload />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards - Show skeleton when loading */}
        {loading ? (
          <StatsSkeleton />
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{bookings.length}</div>
              <div className="mt-1 text-xs text-gray-400">Total Bookings</div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-emerald-400">
                {bookings.filter(b => b.approved).length}
              </div>
              <div className="mt-1 text-xs text-gray-400">Approved</div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400">
                {bookings.filter(b => b.booking_status === 'playing').length}
              </div>
              <div className="mt-1 text-xs text-gray-400">Live Now</div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-amber-400">
                {bookings.filter(b => b.booking_status === 'pending').length}
              </div>
              <div className="mt-1 text-xs text-gray-400">Pending</div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-slate-400">
                {bookings.filter(b => b.booking_status === 'completed').length}
              </div>
              <div className="mt-1 text-xs text-gray-400">Completed</div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-rose-400">
                {bookings.filter(b => b.booking_status === 'cancelled').length}
              </div>
              <div className="mt-1 text-xs text-gray-400">Cancelled</div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900/30 p-4 backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by advertiser, screen, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Mobile Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-white md:hidden"
          >
            <FaFilter />
            Filters
            <FaCaretDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Desktop Filters */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-700 bg-gray-800/50 py-2.5 pl-4 pr-10 text-white backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="playing">Live Now</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-lg border border-gray-700 bg-gray-800/50 py-2.5 pl-4 pr-10 text-white backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="date">Sort by Date</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
              <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="playing">Live Now</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-white"
              >
                <option value="date">Sort by Date</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bookings Grid - Show skeleton when loading */}
      {loading ? (
        <BookingCardsSkeleton />
      ) : sortedBookings.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedBookings?.map((booking) => {
            const status = statusConfig[booking.booking_status] || statusConfig.pending;
            const paymentStatus = paymentConfig[booking.payment_status] || paymentConfig.pending;

            return (
              <div
                key={booking._id}
                className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-950/50 p-4 backdrop-blur-sm transition-all hover:border-gray-700 hover:shadow-xl hover:shadow-blue-500/5"
              >
                {/* Corner Status Indicator */}
                <div className={`absolute right-0 top-0 h-2 w-full ${status.color}`} />

                <div className="relative">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
                        #{booking?._id}
                      </span>
                      <div className="mt-2 flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </div>
                      </div>
                    </div>
                    {booking?.booking_status!=="rejected" &&(
                      <div className={`text-xs rounded-full px-3 py-1 ${paymentStatus.bg} ${paymentStatus.border} border ${paymentStatus.color}`}>
                      {paymentStatus.label}
                    </div>
                    )
                    }

                    


                  </div>

                  {/* Card Content */}
                  <div className="mt-4">
                    <h3 className="mb-3 line-clamp-1 text-lg font-semibold text-white">
                      {booking?.advertiser_id?.name?? booking?.advertiser?.name}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-800 p-2">
                          <MdScreenShare className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Screen</p>
                          <p className="font-medium text-white">{booking?.screen?.screenName ?? booking?.screen_id?.screenName }</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-800 p-2">
                          <MdLocationOn className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="font-medium text-white">{booking?.screen?.address?.city?? booking?.screen_id?.address?.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-800 p-2">
                          <FaCalendarAlt className="text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Schedule</p>
                          <p className="font-medium text-white">
                            {formatDate(booking.start_datetime)} • {formatTimeOnly(booking.start_datetime)}
                          </p>

                            <p className="font-medium text-white">
                            {formatDate(booking.end_datetime)} • {formatTimeOnly(booking.end_datetime)}
                          </p>
                        </div>
                      </div>

                      {/* Ad Files Preview */}
                      <div className="rounded-lg bg-gray-800/50 p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaFile className="text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {booking.adfiles?.length || 0} Ad Files
                            </span>
                          </div>
                          <div className="flex -space-x-2">
                            {booking.adfiles?.slice(0, 3).map((file, idx) => {
                              const ext = file?.split(".").pop()?.toLowerCase();
                              const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext);
                              return (
                                <div key={idx} className="rounded-full border-2 border-gray-900 bg-gray-700 p-1.5">
                                  {isVideo ? (
                                    <FaVideo className="text-xs text-blue-400" />
                                  ) : (
                                    <FaImage className="text-xs text-emerald-400" />
                                  )}
                                </div>
                              );
                            })}
                            {booking.adfiles?.length > 3 && (
                              <div className="rounded-full border-2 border-gray-900 bg-gray-700 px-2 py-1 text-xs text-gray-300">
                                +{booking.adfiles.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price and Duration */}
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-3">
                      <div>
                        <p className="text-sm text-gray-400">Price</p>
                        <div className="flex items-center gap-1">

                        
                            <p className="text-gray-300 font-bold">{ getCurrencySymbol(booking?.currency)}</p>
                            
                       
                         
                          <span className="text-xl font-bold text-white">
                            {booking.price?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-gray-400">{booking.currency}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Duration</p>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-400" />
                          <span className="font-medium text-white">
                            {booking.duration_minutes} mins
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FaEye />
                        View Details
                      </span>
                    </button>

                    {user?.role == "advertiser" ? (

                      <div>

                         <button
                        disabled={!booking?.approved || booking?.booking_status=="rejected" ||booking?.payment_status=="paid"}
                        onClick={()=> payHandler(booking) }
                        className={`rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm font-medium text-white transition-all
                                   hover:bg-gray-800
                                   disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-800/50   ${booking?.booking_status=="rejected" ||booking?.payment_status=="paid"?"hidden":"block"}`}
                      >
                        Pay Now
                      </button>
                      {
DeleteLoader?( <Loader/>):(
  <button
                    
                        onClick={()=>  DeleteHandler(booking?._id,booking?.adfiles) }
                        className={`rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm font-medium text-white transition-all
                                   hover:bg-gray-800
                                   disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-800/50 ${!booking?.approved && booking?.booking_status=="rejected" ?"block":"hidden"} `}
                      >
                        Delete
                      </button>
)
                      }

                     

                       


                      </div>
                   
                    ) : (
                      <div className='flex gap-1 flex-wrap'>
                        <button
                          disabled={booking?.approved || booking?.booking_status=="rejected"}
                          onClick={() => { UpdateHandler(booking?._id, true,"bookingapprovel") }}
                          className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm font-medium text-white transition-all
                                   hover:bg-gray-800
                                   disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-800/50"
                        >
                          Accept
                        </button>
                        <button

                          disabled={booking?.approved || booking?.booking_status=="rejected"}

                            onClick={() => { UpdateHandler(booking?._id, "rejected","bookingStatusUpdate") }}


                          className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm font-medium text-white transition-all
                                   hover:bg-gray-800
                                   disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-800/50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Approval Badge */}

{
  booking?.booking_status!=="rejected" &&  <div className="mt-4">
                    {booking.approved ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                        <FaCheckCircle />
                        Approved
                      </div>
                    ) 
                    : 
                    (
                      <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                        <FaHourglassHalf />
                        Pending Approval
                      </div>
                    )}
                  </div>
}
                 


                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="col-span-full rounded-2xl border border-dashed border-gray-800 bg-gray-900/20 p-12 text-center">
          <div className="mx-auto max-w-md">
            <FaExclamationCircle className="mx-auto text-4xl text-gray-600" />
            <h3 className="mt-4 text-xl font-semibold text-white">No bookings found</h3>
            <p className="mt-2 text-gray-400">
              Try adjusting your filters or search term to find what you're looking for.
            </p>
            <button
              onClick={() => { setFilter('all'); setSearchTerm(''); }}
              className="mt-6 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedBooking && mediaShow&& (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="flex h-[95vh] w-[96%] max-w-7xl flex-col overflow-hidden rounded-xl bg-zinc-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <FaEye /> Media Viewer
                </h2>
                <p className="text-xs text-zinc-400">
                  {selectedBooking.advertiser_name}
                  <span className="ml-2 rounded bg-zinc-800 px-2 py-[2px]">
                    #{selectedBooking.id}
                  </span>
                </p>
              </div>

              <button
                onClick={closeDetails}
                className="rounded-full p-2 hover:bg-zinc-800"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-4 overflow-hidden p-3 md:flex-row">
              {/* Main Media */}
              <div
                ref={mediaContainerRef}
                className="relative flex h-[45vh] flex-1 items-center justify-center overflow-hidden rounded-xl bg-black md:h-full"
              >
                {(() => {
                  const mediaUrl = selectedBooking.adfiles[currentMediaIndex];
                  const ext = mediaUrl?.split(".").pop()?.toLowerCase();
                  const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext);
                  const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);

                  if (isVideo) {
                    return (
                      <>
                        <video
                          ref={videoRef}
                          src={mediaUrl}
                          autoPlay={isPlaying}
                          muted={isMuted}
                          loop
                          playsInline
                          className="h-full w-full object-contain"
                        />

                        {/* Controls */}
                        <div className="absolute inset-0 flex flex-col justify-between bg-black/30">
                          {/* Top */}
                          <div className="flex justify-end p-3 text-xs">
                            {currentMediaIndex + 1} / {selectedBooking.adfiles.length}
                          </div>

                          {/* Center */}
                          <div className="flex items-center justify-center gap-6">
                            <button
                              onClick={prevMedia}
                              className="rounded-full bg-black/70 p-3"
                            >
                              <FaChevronLeft />
                            </button>

                            <button
                              onClick={togglePlayPause}
                              className="rounded-full bg-black/70 p-4 text-xl"
                            >
                              {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>

                            <button
                              onClick={nextMedia}
                              className="rounded-full bg-black/70 p-3"
                            >
                              <FaChevronRight />
                            </button>
                          </div>

                          {/* Bottom */}
                          <div className="flex items-center gap-3 p-3">
                            <div
                              onClick={handleProgressClick}
                              className="h-1 flex-1 cursor-pointer rounded bg-zinc-700"
                            >
                              <div
                                className="h-full rounded bg-green-500"
                                style={{ width: `${mediaProgress}%` }}
                              />
                            </div>

                            <span className="text-xs">
                              {formatTime(mediaCurrentTime)} / {formatTime(mediaDuration)}
                            </span>

                            <button onClick={toggleMute}>
                              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>

                            <button onClick={toggleFullscreen}>
                              {isFullscreen ? <FaCompress /> : <FaExpand />}
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  }

                  if (isImage) {
                    return (
                      <img
                        src={mediaUrl}
                        alt="Ad"
                        className="h-full w-full object-contain"
                      />
                    );
                  }

                  return (
                    <div className="text-center text-zinc-400">
                      <FaFile className="mx-auto mb-2 text-3xl" />
                      <p className="text-sm">Unsupported file</p>
                      <a
                        href={mediaUrl}
                        target="_blank"
                        className="mt-2 inline-block rounded bg-green-500 px-4 py-2 text-black"
                      >
                        Download
                      </a>
                    </div>
                  );
                })()}
              </div>

              {/* Right Panel */}
              <div className="flex w-full flex-col gap-4 md:w-[320px]">
                {/* Thumbnails */}
                <div className="rounded-xl bg-zinc-800 p-3">
                  <h4 className="mb-2 text-xs font-semibold">Ad Files</h4>
                  <div className="flex gap-3 overflow-x-auto md:grid md:grid-cols-3">
                  {selectedBooking.adfiles.map((file, index) => {
  const ext = file?.split(".").pop()?.toLowerCase();
  const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext);
  const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);

  return (
    <div
      key={index}
      onClick={() => setCurrentMediaIndex(index)}
      className={`relative min-w-[80px] cursor-pointer overflow-hidden rounded-lg p-1 transition-all
        ${index === currentMediaIndex
          ? "ring-2 ring-green-500 bg-zinc-800"
          : "bg-zinc-700 hover:bg-zinc-600"
        }`}
    >
      {/* Thumbnail */}
      {isImage ? (
        <img
          src={file}
          alt="Ad file"
          loading="lazy"
          className="h-16 w-full rounded object-cover"
          onError={(e) => (e.currentTarget.src = "/image-placeholder.png")}
        />
      ) : isVideo ? (
        <div className="relative flex h-16 w-full items-center justify-center rounded bg-black">
          <FaPlayCircle className="text-2xl text-white/80" />
        </div>
      ) : (
        <div className="flex h-16 w-full items-center justify-center rounded bg-zinc-800">
          <FaFile className="text-xl text-zinc-400" />
        </div>
      )}

      {/* File Type Badge */}
      <span
        className={`absolute right-1 top-1 rounded px-1.5 py-[2px] text-[9px] font-semibold
          ${isVideo
            ? "bg-blue-600 text-white"
            : isImage
              ? "bg-emerald-600 text-white"
              : "bg-zinc-600 text-white"
          }`}
      >
        {isVideo ? "VIDEO" : isImage ? "IMAGE" : "FILE"}
      </span>

      {/* Filename */}
      <p className="mt-1 truncate text-[10px] text-zinc-300">
        {file.split("/").pop()}
      </p>
    </div>
  );
})}

                  </div>
                </div>

                {/* QR CODE */}
                {selectedBooking.qrcode && (
                  <div className="rounded-xl bg-zinc-800 p-4 text-center">
                    <h4 className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold">
                      <FaQrcode /> Campaign QR
                    </h4>
                    <img
                      src={selectedBooking.qrcode}
                      className="mx-auto h-36 w-36 rounded bg-white p-2"
                    />
                    <p className="mt-2 text-xs text-zinc-400">
                      Scan to visit campaign
                    </p>
                    {selectedBooking.redirectlink && (
                      <a
                        href={selectedBooking.redirectlink}
                        target="_blank"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-green-500"
                      >
                        <FaExternalLinkAlt /> Open Link
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>):(

      <AdSlotPayment selectedBooking={selectedBooking&&selectedBooking} setstep={setstep}/>
    )

}
</>

   
  );
};

export default BookingList;