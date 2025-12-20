


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
  FaFile
} from 'react-icons/fa';
import { MdLocationOn, MdScreenShare } from 'react-icons/md';
import { Context } from '../Context_holder';



const BookingList = () => {

    const {usertoken,user,FetchApi}=useContext(Context)

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [mediaCurrentTime, setMediaCurrentTime] = useState(0);

  const videoRef = useRef(null);
  const mediaContainerRef = useRef(null);
  const progressIntervalRef = useRef(null);


console.log(selectedBooking,">>");

  
    useEffect(() => {
          if (!user || !usertoken) return;
       
  
          FetchApi(null, import.meta.env.VITE_USER_URL, "getbookings", user?._id, null, null, usertoken)
              .then((res) => {
                  setBookings(res);
                
              })
              .catch((err) => {
                  setBookings([]);
                 
                  notify('Failed to load screens', 0);
              })
           
      }, [user, usertoken]);

  // Filter bookings based on status
  const filteredBookings = bookings.filter(booking => {
    if (filter !== 'all' && booking.booking_status !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        booking.advertiser_name.toLowerCase().includes(term) ||
        booking.screen_name.toLowerCase().includes(term) ||
        booking.location.toLowerCase().includes(term)
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
    pending: { color: '#FFA500', icon: <FaHourglassHalf />, label: 'Pending' },
    confirmed: { color: '#28A745', icon: <FaCheckCircle />, label: 'Confirmed' },
    cancelled: { color: '#DC3545', icon: <FaTimesCircle />, label: 'Cancelled' },
    playing: { color: '#17A2B8', icon: <FaPlayCircle />, label: 'Live Now' },
    completed: { color: '#6C757D', icon: <FaCheckCircle />, label: 'Completed' },
    expired: { color: '#6C757D', icon: <FaExclamationCircle />, label: 'Expired' }
  };

  // Payment status configuration
  const paymentConfig = {
    pending: { color: '#FFA500', label: 'Payment Pending' },
    paid: { color: '#28A745', label: 'Paid' },
    failed: { color: '#DC3545', label: 'Payment Failed' },
    refunded: { color: '#6C757D', label: 'Refunded' }
  };

  const handlePayment = (bookingId) => {
    alert(`Proceed to payment for booking ${bookingId}`);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setCurrentMediaIndex(0);
    setIsPlaying(true);
  };

  const closeDetails = () => {
    setSelectedBooking(null);
    setCurrentMediaIndex(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    clearInterval(progressIntervalRef.current);
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
    if (currentMedia.type === 'video') {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mediaContainerRef.current?.requestFullscreen();
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
    if (videoRef.current && currentMedia.type === 'video') {
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeOnly = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Media progress tracking
  useEffect(() => {
    if (selectedBooking && selectedBooking.adfiles) {
      const currentMedia = selectedBooking.adfiles[currentMediaIndex];
      
      if (currentMedia.type === 'video' && videoRef.current) {
        const video = videoRef.current;
        
        const updateProgress = () => {
          setMediaCurrentTime(video.currentTime);
          setMediaDuration(video.duration);
          setMediaProgress((video.currentTime / video.duration) * 100);
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
          video.removeEventListener('loadedmetadata', () => {});
        };
      } else if (currentMedia.type === 'image') {
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

  const currentMedia = selectedBooking?.adfiles?.[currentMediaIndex];

  return (
    <div className="slot-bookings-container">
      {/* Header */}
      <header className="bookings-header">
        <div className="header-content">
          <h1><FaCalendarAlt /> Slot Bookings</h1>
          <p className="subtitle">Manage and track your advertising slot bookings</p>
        </div>
        <div className="stats-summary">
          <div className="stat-card">
            <span className="stat-number">{bookings.length}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{bookings.filter(b => b.approved).length}</span>
            <span className="stat-label">Approved</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{bookings.filter(b => b.booking_status === 'playing').length}</span>
            <span className="stat-label">Live Now</span>
          </div>
        </div>
      </header>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by advertiser, screen, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
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

          <div className="filter-group">
            <FaSort className="filter-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date">Sort by Date</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="bookings-grid">
        {sortedBookings.length > 0 ? (
          sortedBookings.map((booking) => {
            const status = statusConfig[booking.booking_status];
            const paymentStatus = paymentConfig[booking.payment_status];
            
            return (
              <div 
                key={booking.id} 
                className={`booking-card ${!booking.approved ? 'not-approved' : ''}`}
              >
                {/* Card Header */}
                <div className="card-header">
                  <div className="booking-id">
                    <span className="booking-badge">#{booking.id}</span>
                  </div>
                  <div className="status-badge" style={{ backgroundColor: status.color }}>
                    {status.icon}
                    <span>{status.label}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="card-content">
                  <div className="booking-info">
                    <h3 className="advertiser-name">{booking.advertiser_name}</h3>
                    
                    <div className="info-row">
                      <MdScreenShare className="info-icon" />
                      <span className="info-text">{booking.screen_name}</span>
                    </div>
                    
                    <div className="info-row">
                      <MdLocationOn className="info-icon" />
                      <span className="info-text">{booking.location}</span>
                    </div>
                    
                    <div className="info-row">
                      <FaCalendarAlt className="info-icon" />
                      <span className="info-text">
                        {formatDate(booking.start_datetime)} • {formatTimeOnly(booking.start_datetime)} - {formatTimeOnly(booking.end_datetime)}
                      </span>
                    </div>
                    
                    <div className="info-row">
                      <FaClock className="info-icon" />
                      <span className="info-text">{booking.duration_minutes} minutes</span>
                    </div>

                    {/* Ad Files Preview */}
                    <div className="adfiles-preview">
                      <div className="adfiles-count">
                        <FaFile className="info-icon" />
                        <span className="info-text">
                          {booking.adfiles.length} Ad {booking.adfiles.length === 1 ? 'File' : 'Files'}
                        </span>
                      </div>
                      <div className="file-types">
                        {booking.adfiles.slice(0, 3).map((file, idx) => (
                          <span key={idx} className="file-type-badge">
                            {file.type === 'video' ? <FaVideo /> : <FaImage />}
                            {file.type}
                          </span>
                        ))}
                        {booking.adfiles.length > 3 && (
                          <span className="file-type-badge">+{booking.adfiles.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price and Payment Section */}
                  <div className="price-section">
                    <div className="price-display">
                      <FaRupeeSign className="currency-icon" />
                      <span className="price-amount">{booking.price.toLocaleString('en-IN')}</span>
                      <span className="currency">{booking.currency}</span>
                    </div>
                    
                    <div className="payment-status" style={{ color: paymentStatus.color }}>
                      {paymentStatus.label}
                    </div>
                    
                    {booking.transaction_id && (
                      <div className="transaction-id">
                        Txn ID: {booking.transaction_id}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="card-actions">
                  <button 
                    className="btn-view"
                    onClick={() => handleViewDetails(booking)}
                  >
                    <FaEye />
                    <span>View Details</span>
                  </button>
                  
                  <button className="btn-download">
                    <FaDownload />
                    <span>Assets</span>
                  </button>
                  
                  <button
                    className={`btn-pay ${booking.approved ? 'approved' : 'not-approved-btn'}`}
                    onClick={() => booking.approved && handlePayment(booking.id)}
                    disabled={!booking.approved}
                    title={booking.approved ? "Proceed to Payment" : "Awaiting Approval"}
                  >
                    <FaCreditCard />
                    <span>{booking.payment_status === 'paid' ? 'View Invoice' : 'Pay Now'}</span>
                  </button>
                </div>

                {/* Approval Badge */}
                <div className="approval-badge">
                  {booking.approved ? (
                    <span className="approved-badge">
                      <FaCheckCircle /> Approved
                    </span>
                  ) : (
                    <span className="pending-approval-badge">
                      <FaHourglassHalf /> Pending Approval
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <FaExclamationCircle />
            <h3>No bookings found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
{selectedBooking && (
  <div className="details-modal-overlay">
    <div className="details-modal">
      {/* Modal Header */}
      <div className="modal-header">
        <div className="modal-header-left">
          <h2>
            <FaEye /> Media Viewer
          </h2>
          <div className="booking-info-header">
            <span className="advertiser-name-header">{selectedBooking.advertiser_name}</span>
            <span className="booking-id-badge">#{selectedBooking.id}</span>
          </div>
        </div>
        <button className="close-modal" onClick={closeDetails}>
          <FaTimes />
        </button>
      </div>

      <div className="modal-content">
        {/* Main Media Display Section */}
        <div className="media-display-section">
          <div className="media-player-container" ref={mediaContainerRef}>
            {(() => {
              // Get current media URL
              const currentMediaUrl = selectedBooking.adfiles[currentMediaIndex];
              
              // Determine file type from URL
              const getFileType = (url) => {
                if (!url) return 'unknown';
                const extension = url.split('.').pop().toLowerCase().split('?')[0];
                const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
                const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
                
                if (videoExtensions.includes(extension)) return 'video';
                if (imageExtensions.includes(extension)) return 'image';
                return 'unknown';
              };
              
              const fileType = getFileType(currentMediaUrl);
              const fileName = currentMediaUrl ? currentMediaUrl.split('/').pop() : 'Media File';
              
              if (fileType === 'video') {
                return (
                  <div className="video-player-wrapper">
                    <video
                      ref={videoRef}
                      src={currentMediaUrl}
                      className="main-media-element"
                      autoPlay={isPlaying}
                      muted={isMuted}
                      loop
                      playsInline
                      onError={(e) => console.error('Video load error:', e)}
                    />
                    <div className="video-controls-overlay">
                      <div className="controls-top">
                      
                        <span className="media-counter">
                          {currentMediaIndex + 1} / {selectedBooking.adfiles.length}
                        </span>
                      </div>
                      
                      <div className="controls-center">
                        <button className="control-btn-large prev-btn" onClick={prevMedia}>
                          <FaChevronLeft />
                        </button>
                        
                        <button className="play-pause-btn" onClick={togglePlayPause}>
                          {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                        
                        <button className="control-btn-large next-btn" onClick={nextMedia}>
                          <FaChevronRight />
                        </button>
                      </div>
                      
                      <div className="controls-bottom">
                        <div className="progress-section">
                          <div className="progress-bar" onClick={handleProgressClick}>
                            <div 
                              className="progress-fill" 
                              style={{ width: `${mediaProgress}%` }}
                            />
                          </div>
                          <span className="time-display">
                            {formatTime(mediaCurrentTime)} / {formatTime(mediaDuration)}
                          </span>
                        </div>
                        
                        <div className="right-controls">
                          <button className="control-btn" onClick={toggleMute}>
                            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                          </button>
                          <button className="control-btn" onClick={toggleFullscreen}>
                            {isFullscreen ? <FaCompress /> : <FaExpand />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else if (fileType === 'image') {
                return (
                  <div className="image-viewer-wrapper">
                    <img 
                      src={currentMediaUrl} 
                      alt={fileName} 
                      className="main-media-element"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                      }}
                    />
                    <div className="image-controls-overlay">
                      <div className="controls-top">
                        <span className="media-info">
                          <FaImage /> {fileName}
                        </span>
                        <span className="media-counter">
                          {currentMediaIndex + 1} / {selectedBooking.adfiles.length}
                        </span>
                      </div>
                      
                      <div className="image-nav-controls">
                        <button className="nav-btn prev-btn" onClick={prevMedia}>
                          <FaChevronLeft />
                        </button>
                        <div className="auto-advance-info">
                          <span className="advance-timer">
                            Auto advances in: {5}s
                          </span>
                        </div>
                        <button className="nav-btn next-btn" onClick={nextMedia}>
                          <FaChevronRight />
                        </button>
                      </div>
                      
                      <div className="fullscreen-control">
                        <button className="control-btn" onClick={toggleFullscreen}>
                          {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="unknown-file-wrapper">
                    <div className="unknown-file-content">
                      <FaFile className="unknown-icon" />
                      <h3>Unsupported File Type</h3>
                      <p>This file cannot be previewed in the browser.</p>
                      <a 
                        href={currentMediaUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="download-file-btn"
                      >
                        <FaDownload /> Download File
                      </a>
                    </div>
                  </div>
                );
              }
            })()}

            {/* QR Code Section - Side by side with thumbnails on desktop */}
            <div className="qr-thumbnail-container">
              {/* Thumbnails */}
              <div className="thumbnail-section">
                <h4 className="thumbnail-title">Media Files</h4>
                <div className="thumbnail-grid">
                  {selectedBooking.adfiles.map((fileUrl, index) => {
                    const getFileType = (url) => {
                      if (!url) return 'unknown';
                      const extension = url.split('.').pop().toLowerCase().split('?')[0];
                      const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
                      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
                      
                      if (videoExtensions.includes(extension)) return 'video';
                      if (imageExtensions.includes(extension)) return 'image';
                      return 'unknown';
                    };
                    
                    const fileType = getFileType(fileUrl);
                    const fileName = fileUrl.split('/').pop();
                    
                    return (
                      <div
                        key={index}
                        className={`thumbnail-item ${index === currentMediaIndex ? 'active' : ''}`}
                        onClick={() => setCurrentMediaIndex(index)}
                      >
                        <div className="thumbnail-preview">
                          {fileType === 'video' ? (
                            <div className="video-thumbnail">
                              <FaVideo className="thumbnail-icon" />
                              <div className="play-overlay">
                                <FaPlay />
                              </div>
                            </div>
                          ) : fileType === 'image' ? (
                            <div className="image-thumbnail">
                              <img 
                                src={fileUrl} 
                                alt={`Thumbnail ${index + 1}`}
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/100x75?text=Image';
                                }}
                              />
                              <FaImage className="thumbnail-icon" />
                            </div>
                          ) : (
                            <div className="unknown-thumbnail">
                              <FaFile className="thumbnail-icon" />
                            </div>
                          )}
                        </div>
                        <span className="thumbnail-label">
                          {fileName.length > 20 ? fileName.substring(0, 17) + '...' : fileName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* QR Code Section */}
              {selectedBooking.qrcode && (
                <div className="qr-code-section">
                  <h4 className="qr-title">
                    <FaQrcode /> Campaign QR Code
                  </h4>
                  <div className="qr-code-wrapper">
                    <img 
                      src={selectedBooking.qrcode} 
                      alt="Campaign QR Code" 
                      className="qr-code-image"
                      onError={(e) => {
                        e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(selectedBooking.redirectlink || 'https://example.com');
                      }}
                    />
                    <div className="qr-info">
                      <p className="qr-description">
                        Scan this QR code to visit the campaign page
                      </p>
                      {selectedBooking.redirectlink && (
                        <a 
                          href={selectedBooking.redirectlink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="qr-link-btn"
                        >
                          <FaExternalLinkAlt />
                          <span>Open Link Directly</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

   
    </div>
  );
};


export default BookingList;



