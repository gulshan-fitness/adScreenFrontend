// import React, { useEffect, useState } from 'react';
// import { useContext } from 'react';
// import io from 'socket.io-client';
// import { Context } from '../Context_holder';
// import { socket } from '../../Socket';



// const ScreenStatus = () => {
//   const { FetchApi, user, usertoken } = useContext(Context);


//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

  
// // Track last ping per screen
// const [activeBookings, setActiveBookings] = useState({});


// const [screenHeartbeat, setScreenHeartbeat] = useState({});





// const isSlotLiveNow = (start, end) => {
//   const now = new Date();
//   return new Date(start) <= now && now < new Date(end);
// };


//   // Extract screen info safely from the first booking (or fallback)

//   const getBookings = async () => {
//     if (!user?._id || !usertoken) return;

//     setLoading(true);
//     try {
//       const res = await FetchApi(
//         null,
//         import.meta.env.VITE_USER_URL,
//         "getbookings",
//         `${user._id}/null`,
//         null,
//         null,
//         usertoken
//       );
//       setBookings(Array.isArray(res) ? res : []);
//     } catch (err) {
//       console.error("Error fetching bookings:", err);
//       setBookings([]);
//     } finally {
//       setLoading(false);
//     }
//   };
// useEffect(() => {
//   if (!socket.connected) socket.connect();

//   const onHeartbeat = (data) => {
//     const { screen_id, booking_id } = data;
//     if (!screen_id || !booking_id) return;

//     setScreenHeartbeat(prev => ({
//       ...prev,
//       [screen_id]: {
//         bookingId: booking_id,
//         lastPing: Date.now(),
//       }
//     }));
//   };

//   socket.on("screen_status", onHeartbeat);

//   return () => {
//     socket.off("screen_status", onHeartbeat);
//   };
// }, []);


//   useEffect(() => {
//     if (user && usertoken) {
        
      
//       getBookings();  



//        if (!socket.connected) {
//           socket.connect();
//         }


      
//         const onConnect = () => {
//           console.log("Socket connected for online screen:", socket.id);
//           socket.emit("onlineScreenUpdateRoom",user._id);
//         };

      
// const onOnlineUpdate = (data) => {
//   if (!data?.booking_id || !data?.screen_id) return;

//   const now = Date.now();

//   // Update last ping first
//   setActiveBookings(prev => ({
//     ...prev,
//     [data.screen_id]: {
//       bookingId: data.booking_id,
//       advertiserId: data.advertiser_id,
//       lastPing: now
//     }
//   }));

//   // Then update bookings list — force correct online/offline
//   setBookings(prev => prev.map(item => {
//     const isThisBooking = item._id === data.booking_id && 
//                           item.screen_id?._id === data.screen_id;

//     const isSameScreenOtherBooking = item.screen_id?._id === data.screen_id &&
//                                      item._id !== data.booking_id;

//     if (isThisBooking) {
//       return { ...item, onlinestatus: true };
//     }
//     if (isSameScreenOtherBooking) {
//       return { ...item, onlinestatus: false };
//     }
//     return item;
//   }));
// };








      
//         const onDisconnect = () => {
//           console.log("Socket disconnected");
//         };
      
//         socket.on("connect", onConnect);
//         socket.on("screen_online_update", onOnlineUpdate);
//         socket.on("disconnect", onDisconnect);
      
//         return () => {
//           socket.off("connect", onConnect);
//           socket.off("screen_online_update", onOnlineUpdate);
//           socket.off("disconnect", onDisconnect);
      
//           // ❌ DO NOT disconnect here
//         };
//     }
//   }, [user, usertoken]);



// useEffect(() => {
//   const interval = setInterval(() => {
//     const now = Date.now();
//     const TIMEOUT = 12000; // 12 seconds buffer (since heartbeat every 5s)

//     setBookings(prevBookings => {
//       let hasOfflineChange = false;
//       const updatedBookings = prevBookings.map(booking => {
//         const screenId = booking?.screen_id?._id;
//         const active = activeBookings[screenId];

//         // Only care about the currently active booking on this screen
//         if (active && booking._id === active.bookingId) {
//           const timeSinceLastPing = now - active.lastPing;

//           if (timeSinceLastPing > TIMEOUT && booking.onlinestatus === true) {
//             hasOfflineChange = true;
//             return { ...booking, onlinestatus: false };
//           }
//         }
//         return booking;
//       });

//       // Optional: clean up stale activeBookings after marking offline
//       if (hasOfflineChange) {
//         setActiveBookings(prev => {
//           const newActive = { ...prev };
//           Object.keys(newActive).forEach(screenId => {
//             if (now - newActive[screenId].lastPing > TIMEOUT) {
//               delete newActive[screenId];
//             }
//           });
//           return newActive;
//         });
//       }

//       return updatedBookings;
//     });
//   }, 3000); // Reduced check frequency: every 3 seconds is enough

//   return () => clearInterval(interval);
// }, [activeBookings]); // Only depend on activeBookings













//   const formatTime = (isoString) => {
//     if (!isoString) return 'Invalid time';
//     return new Date(isoString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   const formatDate = (isoString) => {
//     if (!isoString) return 'Invalid date';
//     return new Date(isoString).toLocaleDateString('en-US', {
//       weekday: 'short',
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   const isLiveNow = (start, end) => {
//     if (!start || !end) return false;
//     const now = new Date();
//     return new Date(start) <= now && now < new Date(end);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
      

//       {/* Main Content */}
//       <main className="px-4 py-6 sm:px-6 max-w-4xl mx-auto">
//         <h2 className="text-lg font-semibold text-gray-800 mb-5">Booked Slots</h2>

//         {loading ? (
//           <div className="flex justify-center py-12">
//             <div className="text-gray-500">Loading bookings...</div>
//           </div>
//         ) : bookings.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
//             <p className="text-gray-500 text-lg">No bookings found</p>
//             <p className="text-sm text-gray-400 mt-2">This screen has no scheduled ads yet.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//          {bookings
//   .sort((a, b) => new Date(b.start_datetime) - new Date(a.start_datetime))
//   .map((booking,index) => {
//     const startTime = formatTime(booking?.start_datetime);
//     const endTime = formatTime(booking?.end_datetime);
//     const date = formatDate(booking?.start_datetime);

//     const isOnline = booking?.onlinestatus ;

//     return (
//       <div
//         key={index}
//         className={`
//           bg-white rounded-xl shadow-sm border p-5 transition-all
//           ${isOnline
//             ? "border-green-300 ring-1 ring-green-100"
//             : "border-red-300"
//           }
//         `}
//       >
//         <div className="flex flex-col gap-4">
//           {/* Top Row: Screen Info + Online Status */}
//           <div className="flex justify-between items-start">
//             <div>
//               <h3 className="font-semibold text-gray-900 text-lg">
//                 {booking?.screen_id?.screenName}
//               </h3>
//               <p className="text-sm text-gray-600 mt-1">
//                 {booking?.screen_id?.address?.street},{booking?.screen_id?.address?.city},
//                 {booking?.screen_id?.address?.state}
//               </p>
//             </div>

//             {/* ONLINE / OFFLINE BADGE */}
//             <span
//               className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full
//                 ${isOnline
//                   ? "text-green-800 bg-green-100"
//                   : "text-red-800 bg-red-100"
//                 }
//               `}
//             >
//               ● {isOnline ? "ONLINE" : "OFFLINE"}
//             </span>
//           </div>

//           {/* Bottom Row: Time Info */}
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-3 border-t border-gray-100">
//             <div>
//               <p className="text-sm text-gray-600">Scheduled Time</p>
//               <p className="font-bold text-lg text-gray-900">
//                 {startTime} – {endTime}
//               </p>
//               <p className="text-sm text-gray-500">{date}</p>
//             </div>

//             <div className="text-right">
//               <p className="text-sm text-gray-600">Duration</p>
//               <p className="font-medium text-gray-900">
//                 {booking?.duration_minutes} minutes
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   })}

//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="px-4 py-6 text-center">
//         <p className="text-xs text-gray-500">
//           Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default ScreenStatus;



import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Context } from '../Context_holder';
import { socket } from '../../Socket';

const ScreenStatus = () => {
  const { FetchApi, user, usertoken } = useContext(Context);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track last ping per screen - this is the source of truth
  const [screenHeartbeat, setScreenHeartbeat] = useState({});

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

  /* =========================
     SOCKET - LISTEN FOR HEARTBEATS
  ========================== */
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onHeartbeat = (data) => {
      const { screen_id, booking_id, advertiser_id } = data;
      if (!screen_id || !booking_id) return;

      setScreenHeartbeat(prev => ({
        ...prev,
        [screen_id]: {
          bookingId: booking_id,
          advertiserId: advertiser_id,
          lastPing: Date.now(),
        }
      }));
    };

    socket.on("screen_status", onHeartbeat);

    return () => {
      socket.off("screen_status", onHeartbeat);
    };
  }, []);

  /* =========================
     SOCKET - ROOM + ONLINE UPDATES
  ========================== */
  useEffect(() => {
    if (!user || !usertoken) return;
    
    getBookings();

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("Socket connected for online screen:", socket.id);
      socket.emit("onlineScreenUpdateRoom", user._id);
    };

    const onOnlineUpdate = (data) => {
      if (!data?.booking_id || !data?.screen_id) return;

      const now = Date.now();

      // Update heartbeat tracker
      setScreenHeartbeat(prev => ({
        ...prev,
        [data.screen_id]: {
          bookingId: data.booking_id,
          advertiserId: data.advertiser_id,
          lastPing: now
        }
      }));
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
    };
  }, [user, usertoken]);

  /* =========================
     TIMEOUT CHECKER - Runs every 2 seconds
     Checks if heartbeat is stale (>10s old)
  ========================== */
  useEffect(() => {
    const TIMEOUT = 10000; // 10 seconds (heartbeat is every 5s, so 2x buffer)
    
    const interval = setInterval(() => {
      const now = Date.now();
      
      setScreenHeartbeat(prev => {
        const updated = { ...prev };
        let hasChanges = false;

        // Clean up stale heartbeats
        Object.keys(updated).forEach(screenId => {
          const timeSinceLastPing = now - updated[screenId].lastPing;
          if (timeSinceLastPing > TIMEOUT) {
            delete updated[screenId];
            hasChanges = true;
          }
        });

        return hasChanges ? updated : prev;
      });
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  /* =========================
     FORMAT HELPERS
  ========================== */
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

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="min-h-screen bg-gray-50">
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
              .map((booking, index) => {
                const startTime = formatTime(booking?.start_datetime);
                const endTime = formatTime(booking?.end_datetime);
                const date = formatDate(booking?.start_datetime);

                const screenId = booking?.screen_id?._id;
                const heartbeat = screenHeartbeat[screenId];

                // CRITICAL: Screen is online ONLY if:
                // 1. Heartbeat exists for this screen
                // 2. The heartbeat is for THIS specific booking
                const isOnline = heartbeat && heartbeat.bookingId === booking._id;

                return (
                  <div
                    key={index}
                    className={`
                      bg-white rounded-xl shadow-sm border p-5 transition-all duration-300
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
                            {booking?.screen_id?.screenName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking?.screen_id?.address?.street}, {booking?.screen_id?.address?.city},
                            {booking?.screen_id?.address?.state}
                          </p>
                        </div>

                        {/* ONLINE / OFFLINE BADGE */}
                        <span
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300
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
                            {booking?.duration_minutes} minutes
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
  );a
};

export default ScreenStatus;