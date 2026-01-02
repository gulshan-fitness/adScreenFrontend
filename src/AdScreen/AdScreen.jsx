// import React, { useState, useEffect, useRef, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { socket } from "../../Socket";
// import { Context } from "../Context_holder";

// const AdScreen = () => {
//   const { id } = useParams();
//   const { usertoken, user, FetchApi } = useContext(Context);

//   const [PlayingScreen, setPlayingScreen] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isFading, setIsFading] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [Loading, setLoading] = useState(false);

//   const videoRef = useRef(null);

//   /* =========================
//      FETCH SCREEN DATA
//   ========================== */
//   const getPlayingscreen = async () => {
//     setLoading(true);
//     try {
//       const res = await FetchApi(
//         null,
//         import.meta.env.VITE_USER_URL,
//         "getPlayingScreen",
//         id,
//         null,
//         null,
//         usertoken
//       );

//       if (res) {
//         setPlayingScreen(res);
//         setCurrentIndex(0);
//         setImageLoaded(false);
//       } else {
//         setPlayingScreen(null);
//       }
//     } catch (err) {
//       console.error("Error fetching playing screen:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      SOCKET CONNECTION
//   ========================== */
  
// useEffect(() => {
//   if (!id || !user || !usertoken) return;

//   getPlayingscreen();

//   if (!socket.connected) {
//     socket.connect();
//   }

//   const onConnect = () => {
//     console.log("🔌 Connected:", socket.id);
//     socket.emit("JoinADScreenRoom", id);
//   };

//   const onAdsUpdate = (data) => {
//     console.log("📺 recentScreen received",data);
//     setPlayingScreen(data);
//     setImageLoaded(false);
//   };

//   socket.on("connect", onConnect);
//   socket.on("recentScreen", onAdsUpdate);

//   return () => {
//     socket.off("connect", onConnect);
//     socket.off("recentScreen", onAdsUpdate);
//     // ❌ DO NOT disconnect here
//   };
// }, [id, usertoken]);



// // AdScreen.jsx (ONLY heartbeat part)

// useEffect(() => {
//   if (!id || !PlayingScreen) return;

//   const emitHeartbeat = () => {
//     socket.emit("screen_status", {
//       screen_id: id,
//       booking_id: PlayingScreen._id,
//       advertiser_id: PlayingScreen.advertiser_id,
//     });
//   };

//   emitHeartbeat(); // immediate
//   const interval = setInterval(emitHeartbeat, 1000);

//   return () => clearInterval(interval);
// }, [id, PlayingScreen?._id]);





//   /* =========================
//      PLAYLIST LOGIC
//   ========================== */
//   const adfiles = PlayingScreen?.adfiles || [];
//   const hasAds = adfiles.length > 0;
//   const hasQrCode = !!PlayingScreen?.qrcode;

//   // QR screen index = adfiles.length
//   const isQrCodeTurn = hasAds && currentIndex === adfiles.length;
//   const currentAd =
//     hasAds && currentIndex < adfiles.length
//       ? adfiles[currentIndex]
//       : null;

//   const isVideo = currentAd
//     ? /\.(mp4|mov|webm|avi|m4v|ogv)$/i.test(currentAd)
//     : false;

//   /* =========================
//      NEXT ITEM (INFINITE LOOP)
//   ========================== */
//   const nextItem = () => {
//     setIsFading(true);
//     setImageLoaded(false);

//     setTimeout(() => {
//       setCurrentIndex((prev) => {
//         if (hasAds) {
//           // Last ad → QR or loop
//           if (prev === adfiles.length - 1) {
//             return hasQrCode ? adfiles.length : 0;
//           }

//           // QR → back to ads
//           if (prev === adfiles.length) {
//             return 0;
//           }

//           return prev + 1;
//         }

//         // Only QR exists
//         return 0;
//       });

//       setIsFading(false);
//     }, 200);
//   };

//   /* =========================
//      IMAGE HANDLING
//   ========================== */
//   useEffect(() => {
//     if (!isVideo && currentAd) setImageLoaded(false);
//   }, [currentAd, isVideo]);

//   const handleImageLoad = () => setImageLoaded(true);

//   /* =========================
//      IMAGE TIMER (6s)
//   ========================== */
//   useEffect(() => {
//     if (isVideo || isQrCodeTurn || !currentAd || !imageLoaded) return;
//     const timer = setTimeout(nextItem, 5000);
//     return () => clearTimeout(timer);
//   }, [currentIndex, imageLoaded]);

//   /* =========================
//      VIDEO AUTOPLAY + END
//   ========================== */
//   useEffect(() => {
//     if (videoRef.current && isVideo) {
//       videoRef.current.currentTime = 0;
//       videoRef.current.play().catch(() => {});
//     }
//   }, [currentIndex, isVideo]);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !isVideo) return;
//     video.addEventListener("ended", nextItem);
//     return () => video.removeEventListener("ended", nextItem);
//   }, [isVideo]);

//   /* =========================
//      QR TIMER (4s)
//   ========================== */
//   useEffect(() => {
//     if (!isQrCodeTurn || !hasQrCode) return;
//     const timer = setTimeout(nextItem, 4000);
//     return () => clearTimeout(timer);
//   }, [isQrCodeTurn]);

//   /* =========================
//      UI
//   ========================== */
//   return (
//     <>
//       <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">

//         {/* LOADING */}
//         {Loading && (
//           <div className="text-white text-3xl animate-pulse">
//             Loading Ads...
//           </div>
//         )}

//         {/* QR FULL SCREEN */}
//         {!Loading && isQrCodeTurn && hasQrCode && (
//           <div
//             className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${
//               isFading ? "opacity-0" : "opacity-100"
//             }`}
//           >
//             <img
//               src={PlayingScreen.qrcode}
//               className="w-80 h-80 bg-white p-6 rounded-2xl"
//               alt="QR"
//             />
//             <p className="text-white mt-6 text-2xl">Scan QR Code</p>
//           </div>
//         )}

//         {/* IMAGE / VIDEO */}
//         {!Loading && !isQrCodeTurn && currentAd && (
//           <div
//             className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
//               isFading ? "opacity-0" : "opacity-100"
//             }`}
//           >
//             {isVideo ? (
//               <video
//                 ref={videoRef}
//                 src={currentAd}
//                 className="w-full h-full object-contain"
//                 muted
//                 autoPlay
//                 playsInline
//               />
//             ) : (
//               <img
//                 src={currentAd}
//                 onLoad={handleImageLoad}
//                 className={`max-w-full max-h-full object-contain transition-opacity duration-1000 ${
//                   imageLoaded ? "opacity-100" : "opacity-0"
//                 }`}
//                 alt="Ad"
//               />
//             )}
//           </div>
//         )}

//         {/* CORNER QR */}
//         {!Loading && !isQrCodeTurn && hasQrCode && (
//           <div className="absolute bottom-4 right-4 bg-white p-3 rounded-xl">
//             <img
//               src={PlayingScreen.qrcode}
//               className="w-24 h-24"
//               alt="QR"
//             />
//             <p className="text-center font-semibold">Scan Me</p>
//           </div>
//         )}

//         {/* NO CONTENT */}
//         {!Loading && !hasAds && !hasQrCode && (
//           <div className="text-white text-3xl">
//             No Ads Available
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AdScreen;




import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../Socket";
import { Context } from "../Context_holder";

const AdScreen = () => {
  const { id } = useParams();
  const { usertoken, user, FetchApi } = useContext(Context);

  const [PlayingScreen, setPlayingScreen] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [Loading, setLoading] = useState(false);

  const videoRef = useRef(null);


  const slotBookings = [
  {
    "_id": "695255daee9c36e63f0f753b",
    "slot_id": "69521b98442a917031c9d0df",
    "screen_id": {
      "address": {
        "coordinates": {
          "type": "Point",
          "coordinates": [75.8189817, 26.9154576]
        },
        "street": "Jaipur",
        "city": "Jaipur",
        "state": "Rajasthan",
        "zipCode": "302001",
        "country": "India"
      },
      "resolution": { "width": 78, "height": 859 },
      "size": { "width": 74.9, "height": 74, "diagonal": 758.2 },
      "_id": "694a3fb0016cf2323ae9b896",
      "screenName": "ram screen",
      "user_id": "693bbd5b688f683288eaebb4",
      "screenType": "lcd",
      "supportedFormats": ["mov","mp4","jpg","png"],
      "maxFileSize": 100,
      "orientation": "portrait",
      "locationType": "railway_station",
      "image": "https://res.cloudinary.com/ddti3nlbr/image/upload/v1766473647/ScreenView/1766473644748_623_Screenshot%202023-11-19%20215220%20-%20Copy%20-%20Copy%20-%20Copy.png",
      "status": true,
      "rating": 0,
      "createdAt": "2025-12-23T07:07:28.321Z",
      "updatedAt": "2025-12-23T07:07:28.321Z",
      "__v": 0
    },
    "advertiser_id": {
      "_id": "693bb234688f683288eaeb9b",
      "name": "gulshan",
      "email": "gulshankumarjangid@gmail.com",
      "role": "advertiser",
      "phone": "918058949490",
      "businessName": "byfoch",
      "taxId": "999999",
      "paymentMethod": "bank_transfer",
      "walletBalance": 0
    },
    "start_datetime": "2026-01-02T11:09:00.000Z",
    "end_datetime": "2026-01-02T11:10:00.000Z",
    "duration_minutes": 30,
    "price": 300,
    "adfiles": ["https://res.cloudinary.com/ddti3nlbr/image/upload/v1765533945/College_Banner/1765533945210_547_images.png"],
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYn...",
    "redirectlink": "sjhvdjs",
    "currency": "INR",
    "booking_status": "confirmed",
    "payment_status": "paid",
    "approved": true,
    "createdAt": "2025-12-29T06:12:21.426Z",
    "updatedAt": "2026-01-02T11:06:59.743Z",
    "transaction_id": "6957a6be719bf2e61a74a55f"
  },
  {
    "_id": "6957775b719bf2e61a74a264",
    "slot_id": "695776f9719bf2e61a74a25f",
    "screen_id": {
      "address": {
        "coordinates": {
          "type": "Point",
          "coordinates": [75.8189817, 26.9154576]
        },
        "street": "Govindgarh Malikpur",
        "city": "Govindgarh",
        "state": "Rajasthan",
        "zipCode": "303712",
        "country": "India"
      },
      "resolution": { "width": 8785, "height": 353 },
      "size": { "width": 353, "height": 553, "diagonal": 3535 },
      "_id": "69424ca896389f65937e0819",
      "screenName": "wscube",
      "user_id": "693bbd5b688f683288eaebb4",
      "screenType": "digital_billboard",
      "supportedFormats": ["avi","mkv"],
      "maxFileSize": 130,
      "orientation": "portrait",
      "locationType": "commercial_complex",
      "image": "https://res.cloudinary.com/ddti3nlbr/image/upload/v1765952679/ScreenView/1765952671262_130_Screenshot%202023-11-19%20215116%20-%20Copy%20%283%29%20-%20Copy.png",
      "status": true,
      "rating": 0,
      "createdAt": "2025-12-17T06:24:41.014Z",
      "updatedAt": "2025-12-17T06:24:41.014Z",
      "__v": 0
    },
    "advertiser_id": {
      "_id": "693bb234688f683288eaeb9b",
      "name": "gulshan",
      "email": "gulshankumarjangid@gmail.com",
      "role": "advertiser",
      "phone": "918058949490",
      "businessName": "byfoch",
      "taxId": "999999",
      "paymentMethod": "bank_transfer",
      "walletBalance": 0
    },
    "start_datetime": "2026-01-02T11:08:00.000Z",
    "end_datetime": "2026-01-02T11:10:00.000Z",
    "duration_minutes": 30,
    "price": 400,
    "adfiles": ["https://res.cloudinary.com/ddti3nlbr/image/upload/v1767339865/slotFiles/1767339865773_132_366421a.avif"],
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYn...",
    "redirectlink": "gym",
    "currency": "INR",
    "booking_status": "playing",
    "payment_status": "paid",
    "approved": true,
    "createdAt": "2026-01-02T07:44:27.535Z",
    "updatedAt": "2026-01-02T11:08:00.012Z",
    "transaction_id": "6957a682719bf2e61a74a543"
  }
];




  /* =========================
     FETCH SCREEN DATA
  ========================== */
  const getPlayingscreen = async () => {
    setLoading(true);
    try {
      const res = await FetchApi(
        null,
        import.meta.env.VITE_USER_URL,
        "getPlayingScreen",
        id,
        null,
        null,
        usertoken
      );

      if (res) {
        setPlayingScreen(res);
        setCurrentIndex(0);
        setImageLoaded(false);
      } else {
        setPlayingScreen(null);
      }
    } catch (err) {
      console.error("Error fetching playing screen:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SOCKET CONNECTION
  ========================== */
  
  useEffect(() => {
    if (!id || !user || !usertoken) return;

    getPlayingscreen();

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("🔌 Connected:", socket.id);
      socket.emit("JoinADScreenRoom", id);
    };

    const onAdsUpdate = (data) => {
      console.log("📺 recentScreen received", data);
      setPlayingScreen(data);
      setImageLoaded(false);
    };

    socket.on("connect", onConnect);
    socket.on("recentScreen", onAdsUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("recentScreen", onAdsUpdate);
    };
  }, [id, usertoken]);

  /* =========================
     HEARTBEAT - Every 5 seconds
  ========================== */
  useEffect(() => {
    if (!id || !PlayingScreen) return;

    const emitHeartbeat = () => {
      socket.emit("screen_status", {
        screen_id: id,
        booking_id: PlayingScreen._id,
        advertiser_id: PlayingScreen.advertiser_id,
      });
    };

    // Emit immediately on mount/change
    emitHeartbeat();
    
    // Then emit every 5 seconds
    const interval = setInterval(emitHeartbeat, 5000);

    return () => clearInterval(interval);
  }, [id, PlayingScreen?._id]);

  /* =========================
     PLAYLIST LOGIC
  ========================== */
  const adfiles = PlayingScreen?.adfiles || [];
  const hasAds = adfiles.length > 0;
  const hasQrCode = !!PlayingScreen?.qrcode;

  // QR screen index = adfiles.length
  const isQrCodeTurn = hasAds && currentIndex === adfiles.length;
  const currentAd =
    hasAds && currentIndex < adfiles.length
      ? adfiles[currentIndex]
      : null;

  const isVideo = currentAd
    ? /\.(mp4|mov|webm|avi|m4v|ogv)$/i.test(currentAd)
    : false;

  /* =========================
     NEXT ITEM (INFINITE LOOP)
  ========================== */
  const nextItem = () => {
    setIsFading(true);
    setImageLoaded(false);

    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (hasAds) {
          // Last ad → QR or loop
          if (prev === adfiles.length - 1) {
            return hasQrCode ? adfiles.length : 0;
          }

          // QR → back to ads
          if (prev === adfiles.length) {
            return 0;
          }

          return prev + 1;
        }

        // Only QR exists
        return 0;
      });

      setIsFading(false);
    }, 200);
  };

  /* =========================
     IMAGE HANDLING
  ========================== */
  useEffect(() => {
    if (!isVideo && currentAd) setImageLoaded(false);
  }, [currentAd, isVideo]);

  const handleImageLoad = () => setImageLoaded(true);

  /* =========================
     IMAGE TIMER (5s)
  ========================== */
  useEffect(() => {
    if (isVideo || isQrCodeTurn || !currentAd || !imageLoaded) return;
    const timer = setTimeout(nextItem, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, imageLoaded]);

  /* =========================
     VIDEO AUTOPLAY + END
  ========================== */
  useEffect(() => {
    if (videoRef.current && isVideo) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex, isVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    video.addEventListener("ended", nextItem);
    return () => video.removeEventListener("ended", nextItem);
  }, [isVideo]);

  /* =========================
     QR TIMER (4s)
  ========================== */
  useEffect(() => {
    if (!isQrCodeTurn || !hasQrCode) return;
    const timer = setTimeout(nextItem, 4000);
    return () => clearTimeout(timer);
  }, [isQrCodeTurn]);

  /* =========================
     UI
  ========================== */
  return (
    <>
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">

        {/* LOADING */}
        {Loading && (
          <div className="text-white text-3xl animate-pulse">
            Loading Ads...
          </div>
        )}

        {/* QR FULL SCREEN */}
        {!Loading && isQrCodeTurn && hasQrCode && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={PlayingScreen.qrcode}
              className="w-80 h-80 bg-white p-6 rounded-2xl"
              alt="QR"
            />
            <p className="text-white mt-6 text-2xl">Scan QR Code</p>
          </div>
        )}

        {/* IMAGE / VIDEO */}
        {!Loading && !isQrCodeTurn && currentAd && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
          >
            {isVideo ? (
              <video
                ref={videoRef}
                src={currentAd}
                className="w-full h-full object-contain"
                muted
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={currentAd}
                onLoad={handleImageLoad}
                className={`max-w-full max-h-full object-contain transition-opacity duration-1000 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                alt="Ad"
              />
            )}
          </div>
        )}

        {/* CORNER QR */}
        {!Loading && !isQrCodeTurn && hasQrCode && (
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-xl">
            <img
              src={PlayingScreen.qrcode}
              className="w-24 h-24"
              alt="QR"
            />
            <p className="text-center font-semibold">Scan Me</p>
          </div>
        )}

        {/* NO CONTENT */}
        {!Loading && !hasAds && !hasQrCode && (
          <div className="text-white text-3xl">
            No Ads Available
          </div>
        )}
      </div>
    </>
  );
};

export default AdScreen;