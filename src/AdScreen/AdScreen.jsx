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
    console.log("📺 recentScreen received",data);
    setPlayingScreen(data);
    setImageLoaded(false);
  };

  socket.on("connect", onConnect);
  socket.on("recentScreen", onAdsUpdate);

  return () => {
    socket.off("connect", onConnect);
    socket.off("recentScreen", onAdsUpdate);
    // ❌ DO NOT disconnect here
  };
}, [id, usertoken]);



useEffect(() => {
  
  if (!id ||!PlayingScreen) return;


const emitStatus = () => {
    const onlinestatus =PlayingScreen?true:false;

 socket.emit("screen_status", {
  screen_id: id,
  booking_id: PlayingScreen?._id || null,
  advertiser_id: PlayingScreen?.advertiser_id || null, // <-- use _id
  onlinestatus: !!PlayingScreen
});


    console.log("📡 screen_status heartbeat:", {
      screen_id: id,
      onlinestatus
    });
  };

  // 🔁 emit immediately

  emitStatus();

  // 🔁 emit every 5 seconds

  const interval = setInterval(emitStatus, 5000);

  return () => {
    clearInterval(interval);
  };

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
     IMAGE TIMER (6s)
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
