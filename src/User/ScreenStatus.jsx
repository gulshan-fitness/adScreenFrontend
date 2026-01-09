import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useContext } from 'react';
import { Context } from '../Context_holder';
import { socket } from '../../Socket';

const ScreenStatus = () => {
  const { FetchApi, user, usertoken } = useContext(Context);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenHeartbeat, setScreenHeartbeat] = useState({});

  const heartbeatRef = useRef({});
  const timeoutRefs = useRef({});
  const lastBookingRef = useRef({});

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

  const handleHeartbeat = useCallback((data) => {
    const { screen_id, booking_id, advertiser_id } = data;
    if (!screen_id || !booking_id) return;

    const now = Date.now();

    if (timeoutRefs.current[screen_id]) {
      clearTimeout(timeoutRefs.current[screen_id]);
    }

    const previousBookingId = lastBookingRef.current[screen_id];
    lastBookingRef.current[screen_id] = booking_id;

    heartbeatRef.current = {
      ...heartbeatRef.current,
      [screen_id]: {
        bookingId: booking_id,
        advertiserId: advertiser_id,
        lastPing: now,
        isActive: true,
      },
    };

    if (previousBookingId && previousBookingId !== booking_id) {
      setScreenHeartbeat((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          if (updated[key]?.bookingId === previousBookingId) {
            updated[key] = { ...updated[key], isActive: false };
          }
        });
        return updated;
      });
    }

    setScreenHeartbeat((prev) => ({
      ...prev,
      [screen_id]: {
        bookingId: booking_id,
        advertiserId: advertiser_id,
        lastPing: now,
        isActive: true,
      },
    }));

    timeoutRefs.current[screen_id] = setTimeout(() => {
      setScreenHeartbeat((prev) => {
        if (!prev[screen_id]) return prev;
        if (Date.now() - prev[screen_id].lastPing >= 10000) {
          return {
            ...prev,
            [screen_id]: { ...prev[screen_id], isActive: false },
          };
        }
        return prev;
      });
    }, 10000);
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = Date.now();
      setScreenHeartbeat((prev) => {
        const updated = { ...prev };
        let changed = false;
        Object.keys(updated).forEach((id) => {
          const hb = updated[id];
          if (hb && hb.isActive && now - hb.lastPing >= 15000) {
            updated[id] = { ...hb, isActive: false };
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    }, 5000);

    return () => clearInterval(checkInterval);
  }, []);


  useEffect(() => {
    if (!user || !usertoken) return;
    getBookings();

    if (!socket.connected) socket.connect();

    const onConnect = () => {
      socket.emit("onlineScreenUpdateRoom", user._id);
      
    };
    socket.on("connect", onConnect);

    return () => socket.off("connect", onConnect);
  }, [user, usertoken]);


  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onHeartbeat = (data) => handleHeartbeat(data);
    const onOnlineUpdate = (data) => handleHeartbeat(data);

    const onDisconnect = () => {
      setScreenHeartbeat((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (updated[id]?.isActive) {
            updated[id] = { ...updated[id], isActive: false };
          }
        });
        return updated;
      });
    };

    socket.on("screen_status", onHeartbeat);
    socket.on("screen_online_update", onOnlineUpdate);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("screen_status", onHeartbeat);
      socket.off("screen_online_update", onOnlineUpdate);
      socket.off("disconnect", onDisconnect);
      Object.values(timeoutRefs.current).forEach(clearTimeout);
    };
  }, [handleHeartbeat]);

  
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const formatDuration = (mins) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  };

  const getBookingStatus = (booking) => {
    const screenId = booking?.screen_id?._id;
    const hb = screenHeartbeat[screenId];

    const isOnline = hb && hb.bookingId === booking._id && hb.isActive;

    let uptime = null;
    if (isOnline && hb.lastPing) {
      const secs = Math.floor((Date.now() - hb.lastPing) / 1000);
      if (secs > 0) {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        uptime = `${m}m ${s}s`;
      }
    }

    return { isOnline, uptime };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Live Screen Status</h2>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 text-gray-600">
              <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg">Loading bookings...</span>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
            <p className="text-gray-500 text-lg font-medium">No active bookings</p>
            <p className="text-gray-400 mt-2">Your screens are ready for new campaigns.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings
              .sort((a, b) => new Date(b.start_datetime) - new Date(a.start_datetime))
              .map((booking) => {
                const { isOnline, uptime } = getBookingStatus(booking);
                const start = formatTime(booking.start_datetime);
                const end = formatTime(booking.end_datetime);
                const date = formatDate(booking.start_datetime);
                const duration = formatDuration(booking.duration_minutes);

                return (
                  <div
                    key={booking._id}
                    className={`
                      relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl
                      ${isOnline
                        ? "bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 ring-4 ring-emerald-100 ring-opacity-40"
                        : "bg-white border border-gray-200"
                      }
                    `}
                  >
                    {/* LIVE Badge */}
                    {isOnline && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-800 bg-emerald-100 rounded-full shadow-md">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </span>
                          LIVE NOW
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Screen Name & Location */}
                      <div className="mb-5">
                        <h3 className="font-bold text-gray-900 text-xl truncate">
                          {booking.screen_id?.screenName || "Unnamed Screen"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {booking.screen_id?.address?.city}, {booking.screen_id?.address?.state}
                        </p>
                      </div>

                      {/* Time & Duration */}
                      <div className="grid grid-cols-2 gap-5 mb-5 text-sm">
                        <div>
                          <p className="text-gray-500 font-medium">Scheduled</p>
                          <p className="font-bold text-gray-900 text-lg">
                            {start} – {end}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{date}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Duration</p>
                          <p className="font-bold text-gray-900 text-lg">{duration}</p>
                        </div>
                      </div>

                      {/* Status Row */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-base font-semibold ${
                            isOnline ? "text-emerald-700" : "text-gray-600"
                          }`}
                        >
                          {isOnline ? "Currently Playing" : "Offline"}
                        </span>

                      </div>

                      {/* Advertiser */}
                      {booking.advertiser_id && (
                        <div className="mt-5 pt-5 border-t border-gray-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Advertiser</p>
                          <p className="text-base font-medium text-gray-800 mt-1 truncate">
                            {booking.advertiser_id.name || booking.advertiser_id.email || "Unknown"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>

      {/* Fixed Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-3">
            <span
              className={`relative flex h-3.5 w-3.5 ${
                socket.connected ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {socket.connected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-current"></span>
            </span>
            <span className={socket.connected ? "text-gray-700 font-medium" : "text-gray-500"}>
              {socket.connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <span className="text-gray-400">•</span>

          <span className="text-gray-500 text-xs">
            Updated: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default ScreenStatus;