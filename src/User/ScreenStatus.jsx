import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import io from 'socket.io-client';
import { Context } from '../Context_holder';
import { socket } from '../../Socket';

const SOCKET_URL = 'http://localhost:4000'; // Update with your server URL

const ScreenStatus = () => {
  const { FetchApi, user, usertoken } = useContext(Context);

  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState('Connecting...');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  
const [activeBooking, setActiveBooking] = useState({
  bookingId: null,
  advertiserId: null,
  lastPing: null
});




  const SCREEN_ID = '694a3fb0016cf2323ae9b896';

  // Extract screen info safely from the first booking (or fallback)
  const screenInfo = {
    screenName: bookings[0]?.screen_id?.screenName || 'Unknown Screen',
    address: {
      street: bookings[0]?.screen_id?.address?.street || 'N/A',
      city: bookings[0]?.screen_id?.address?.city || 'N/A',
      state: bookings[0]?.screen_id?.address?.state || 'N/A',
      zipCode: bookings[0]?.screen_id?.address?.zipCode || '',
      country: bookings[0]?.screen_id?.address?.country || 'India'
    }
  };

  const fullAddress = [
    screenInfo.address.street,
    screenInfo.address.city,
    screenInfo.address.state,
    screenInfo.address.zipCode
  ]
    .filter(Boolean)
    .join(', ') || 'Location not available';

  const getBookings = async () => {
    if (!user?._id || !usertoken) return;

    setLoading(true);
    try {
      const res = await FetchApi(
        null,
        import.meta.env.VITE_USER_URL,
        "getbookings",
        `${user._id}/null`,
        null,
        null,
        usertoken
      );
      setBookings(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && usertoken) {
        
      getBookings();

       if (!socket.connected) {
          socket.connect();
        }
      
        const onConnect = () => {
          console.log("Socket connected for online screen:", socket.id);
          socket.emit("onlineScreenUpdateRoom",user._id);
        };
      
const onOnlineUpdate = (data) => {
  if (!data?.booking_id || !data?.advertiser_id) return;

  setBookings(prev => {
    let updated = [...prev];

    // If SAME booking emits again → just refresh ping, no state change
    if (
      activeBooking.bookingId === data.booking_id &&
      activeBooking.advertiserId === data.advertiser_id
    ) {
      setActiveBooking(prev => ({
        ...prev,
        lastPing: Date.now()
      }));
      return updated;
    }

    // NEW booking emits → previous one OFFLINE
    updated = updated.map(item => {
      if (
        item?._id === activeBooking.bookingId &&
        item?.advertiser_id?._id === activeBooking.advertiserId
      ) {
        return { ...item, onlinestatus: false };
      }

      if (
        item?._id === data.booking_id &&
        item?.advertiser_id?._id === data.advertiser_id
      ) {
        return { ...item, onlinestatus: true };
      }

      return item;
    });

    // Set new active booking
    setActiveBooking({
      bookingId: data.booking_id,
      advertiserId: data.advertiser_id,
      lastPing: Date.now()
    });

    return updated;
  });
};




      
        const onDisconnect = () => {
          console.log("Socket disconnected");
        };
      
        socket.on("connect", onConnect);
        socket.on("screen_online_update", onOnlineUpdate);
        socket.on("disconnect", onDisconnect);
      
        return () => {
          socket.off("connect", onConnect);
          socket.off("screen_online_update", onOnlineUpdate);
          socket.off("disconnect", onDisconnect);
      
          // ❌ DO NOT disconnect here
        };
    }
  }, [user, usertoken]);


useEffect(() => {
  const interval = setInterval(() => {
    if (!activeBooking.lastPing) return;

    const diff = Date.now() - activeBooking.lastPing;

    if (diff > 5000) {
      console.log("❌ Active booking timed out");

      setBookings(prev =>
        prev.map(item => {
          if (
            item?._id === activeBooking.bookingId &&
            item?.advertiser_id?._id === activeBooking.advertiserId
          ) {
            return { ...item, onlinestatus: false };
          }
          return item;
        })
      );

      setActiveBooking({
        bookingId: null,
        advertiserId: null,
        lastPing: null
      });
    }
  }, 5000);

  return () => clearInterval(interval);
}, [activeBooking]);




  const formatTime = (isoString) => {
    if (!isoString) return 'Invalid time';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Invalid date';
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isLiveNow = (start, end) => {
    if (!start || !end) return false;
    const now = new Date();
    return new Date(start) <= now && now < new Date(end);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Booked Slots</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-gray-500">Loading bookings...</div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-sm text-gray-400 mt-2">This screen has no scheduled ads yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
         {bookings
  .sort((a, b) => new Date(b.start_datetime) - new Date(a.start_datetime))
  .map((booking,index) => {
    const startTime = formatTime(booking?.start_datetime);
    const endTime = formatTime(booking?.end_datetime);
    const date = formatDate(booking?.start_datetime);

    const isOnline = booking?.onlinestatus ;

    return (
      <div
        key={index}
        className={`
          bg-white rounded-xl shadow-sm border p-5 transition-all
          ${isOnline
            ? "border-green-300 ring-1 ring-green-100"
            : "border-red-300"
          }
        `}
      >
        <div className="flex flex-col gap-4">
          {/* Top Row: Screen Info + Online Status */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {screenInfo.screenName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {fullAddress}
              </p>
            </div>

            {/* ONLINE / OFFLINE BADGE */}
            <span
              className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full
                ${isOnline
                  ? "text-green-800 bg-green-100"
                  : "text-red-800 bg-red-100"
                }
              `}
            >
              ● {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          {/* Bottom Row: Time Info */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-3 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-600">Scheduled Time</p>
              <p className="font-bold text-lg text-gray-900">
                {startTime} – {endTime}
              </p>
              <p className="text-sm text-gray-500">{date}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium text-gray-900">
                {booking.duration_minutes} minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  })}

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-4 py-6 text-center">
        <p className="text-xs text-gray-500">
          Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </footer>
    </div>
  );
};

export default ScreenStatus;