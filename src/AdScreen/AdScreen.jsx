




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
    "_id": "69521bc5442a917031c9d0e8",
    "slot_id": "69521b82442a917031c9d0dc",
    "screen_id": "694a3fb0016cf2323ae9b896",
    "advertiser_id": "693bb234688f683288eaeb9b",
    "start_datetime": "2026-01-02T11:08:00.000Z",
    "end_datetime": "2026-01-02T11:09:00.000Z",
    "duration_minutes": 30,
    "price": 200,
    "adfiles": [
      "https://res.cloudinary.com/ddti3nlbr/video/upload/v1766988738/slotFiles/1766988737678_97_AQMalpgAPHxiPanTRKl3llPgiPEiwjTho6Z4IyY5v3xVLRd7RF-FmUngdN8KQsEWs5lRYJwk9zxgIesJynXP0VV0-VEED.mp4"
    ],
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAALBSURBVO3BQQ7bWAwFwX6E7n/lniy5+oAg2RMzrIp/sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKxUNJ+CaVkyScqNyRhG9SeaJYoxRrlGKNcvEylTcl4SQJJyonSehUTlTelIQ3FWuUYo1SrFEuPiwJd6jcoXKShE6lU3kiCXeofFKxRinWKMUapVijXGyRhDuS0KmcJKFTOUnCicqJyonKJxVrlGKNUqxRLh5KwjepnCThm1TuSMKJypuKNUqxRinWKBcvU+nuUOlUTlROktCpnCThJAmdSqdyh0qXhC4Jncodi4o1SrFGKdYok6icqJwk4USlU+mScKLyScUapVijFGuUiw9Lwjc8odKpdEnoVO5IwpuKNUqxRinWKBcPqXRJ6FSeSEKncqJykvJEJEn6AAAFy0lEQVREEr5JpUvCJxVrlGKNUqxRLl6WhDcl4SQJnUqXhE6lU+mScKLyRLFGKdYoxRrl4mUqdyThJAmdSpdFlROVk4U3JXFZsUYp1ijFGuXiw5LwTUm4Q6VLQpciid+WXFatUYo1SrFGufiwJJwk4Y4kdConSegWTm3aYnFH0VvFGqVYoxRrlIsnVE6S0KmcqJyo3KHSJeGOVVvcdq1YoxRrlGKNEv9gAElUvVWsUYo1SrFGuXgoCd+k0qncodIloVsk8duSq9ZavFGsUYo1SrFGiX+wTk4P8EqxRinWKMUa5eKhJHyTykn2JbHJ4rZFJ5NUHyrWKMUapVijXPwDqL7Q/1P1T6VYoxRrlGKNEv9gYapvKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYo/wKauPWLp8A8qAAAAABJRU5ErkJggg==",
    "redirectlink": "sjhvdjs",
    "currency": "INR",
    "booking_status": "completed",
    "payment_status": "paid",
    "approved": true,
    "createdAt": "2025-12-29T06:12:21.426Z",
    "updatedAt": "2026-01-02T11:09:00.008Z",
    "__v": 0,
    "transaction_id": "6957a6a3719bf2e61a74a551"
  },
  {
    "_id": "695255daee9c36e63f0f753b",
    "slot_id": "69521b98442a917031c9d0df",
    "screen_id": "694a3fb0016cf2323ae9b896",
    "advertiser_id": "693bb234688f683288eaeb9b",
    "start_datetime": "2026-01-02T11:09:00.000Z",
    "end_datetime": "2026-01-02T11:10:00.000Z",
    "duration_minutes": 30,
    "price": 300,
    "adfiles": [
      "https://res.cloudinary.com/ddti3nlbr/image/upload/v1765533945/College_Banner/1765533945210_547_images.png"
    ],
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAALBSURBVO3BQQ7bWAwFwX6E7n/lniy5+oAg2RMzrIp/sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKxUNJ+CaVkyScqNyRhG9SeaJYoxRrlGKNcvEylTcl4SQJJyonSehUTlTelIQ3FWuUYo1SrFEuPiwJd6jcoXKShE6lU3kiCXeofFKxRinWKMUapVijXGyRhDuS0KmcJKFTOUnCicqJyonKJxVrlGKNUqxRLh5KwjepnCThm1TuSMKJypuKNUqxRinWKBcvU+nuUOlUTlROktCpnCThJAmdSqdyh0qXhC4Jncodi4o1SrFGKdYok6icqJwk4USlU+mScKLyScUapVijFGuUiw9Lwjc8odKpdEnoVO5IwpuKNUqxRinWKBcPqXRJ6FSeSEKncqJykvJEJEn6AAAFy0lEQVTEEr5JpUvCJxVrlGKNUqxRLl6WhDcl4SQJnUqXhE6lU+mScKLyRLFGKdYoxRrl4mUqdyThJAmdSpdFlROVk4U3JXFZsUYp1ijFGuXiw5LwTUm4Q6VLQpciid+WXFatUYo1SrFGufiwJJwk4Y4kdConSegWTm3aYnFH0VvFGqVYoxRrlIsnVE6S0KmcqJyo3KHSJeGOVVvcdq1YoxRrlGKNEv9gAElUvVWsUYo1SrFGuXgoCd+k0qncodIloVsk8duSq9ZavFGsUYo1SrFGiX+wTk4P8EqxRinWKMUa5eKhJHyTykn2JbHJ4rZFJ5NUHyrWKMUapVijXPwDqL7Q/1P1T6VYoxRrlGKNEv9gYapvKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYo/wKauPWLp8A8qAAAAABJRU5ErkJggg==",
    "redirectlink": "sjhvdjs",
    "currency": "INR",
    "booking_status": "completed",
    "payment_status": "paid",
    "approved": true,
    "createdAt": "2025-12-29T06:12:21.426Z",
    "updatedAt": "2026-01-02T11:10:00.020Z",
    "__v": 0,
    "transaction_id": "6957a6be719bf2e61a74a55f"
  },
  {
    "_id": "6957775b719bf2e61a74a264",
    "slot_id": "695776f9719bf2e61a74a25f",
    "screen_id": "69424ca896389f65937e0819",
    "advertiser_id": "693bb234688f683288eaeb9b",
    "start_datetime": "2026-01-02T11:08:00.000Z",
    "end_datetime": "2026-01-02T11:10:00.000Z",
    "duration_minutes": 30,
    "price": 400,
    "adfiles": [
      "https://res.cloudinary.com/ddti3nlbr/image/upload/v1767339865/slotFiles/1767339865773_132_366421a.avif"
    ],
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK3SURBVO3BQW7sWAwEwSxC979yjpdcPUCQusfmZ0T8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtU7khCp3JHEr5J5YlijVKsUYo1ysXLVN6UhDuS0Kl0SThROVF5UxLeVKxRijVKsUa5+LAk3KFyRxJOknCi8kQS7lD5pGKNUqxRijXKxT9GZbJijVKsUYo1ysVwKidJ6FT+smKNUqxRijXKxYepfJNKl4QTlSdUfpNijVKsUYo1ysXLkvCbqXRJ6FROkvCbFWuUYo1SrFEuHlL5y1ROVP6SYo1SrFGKNcrFQ0noVLokvEmlU7kjCZ3KSRLepPJJxRqlWKMUa5T4gxcl4Q6VO5JwonKShCdUnkjCicoTxRqlWKMUa5SLD1M5SUKn0iXhRKVLwolKl4ROpUtCl4ROpUvCHSpvKtYoxRqlWKPEH3xQEjqVLgknKidJ+CaVkyQ8ofJEsUYp1ijFGuXiZUnoVLoknKh0SThR6ZLQqZwkoVM5SUKn0qmcJKFTeVOxRinWKMUa5eJlKicqd6icJOEkCZ3KJyWhU+lUuiR0Kk8Ua5RijVKsUeIPHkjCN6k8kYROpUtCp3KShCdU3lSsUYo1SrFGuXiZypuScJKEE5VO5UTlJAknKl0STpLQqTxRrFGKNUqxRrn4sCTcofKEykkSOpUuCZ1Kp9Il4Q6VTyrWKMUapVijXPzjknCShE6lU+mS0Kl8U7FGKdYoxRrl4h+j0iWhU+mS0CWhU+lU/k/FGqVYoxRrlIsPU/kklS4JTyThROUkCZ3KNxVrlGKNUqxRLl6WhG9KwonKSRI6lZMkdCqdSpeEE5U3FWuUYo1SrFHiD9YYxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFG+Q/DiB/TOksfiAAAAABJRU5ErkJggg==",
    "redirectlink": "gym",
    "currency": "INR",
    "booking_status": "completed",
    "payment_status": "paid",
    "approved": true,
    "createdAt": "2026-01-02T07:44:27.535Z",
    "updatedAt": "2026-01-02T11:10:00.016Z",
    "__v": 0,
    "transaction_id": "6957a682719bf2e61a74a543"
  }
];




console.log(PlayingScreen,"PlayingScreen");


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


      } 
      
      else {

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
        screen_id: PlayingScreen?.screen_id,
        booking_id: PlayingScreen._id,
        advertiser_id: PlayingScreen.advertiser_id,
      });
      console.log("emitedf", {
        screen_id: PlayingScreen?.screen_id,
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
      <div className="absolute top-[100px] left-0">
  <button className=" px-3 mr-2 py-2  bg-slate-400" onClick={()=>setPlayingScreen(slotBookings[0])}>
           1
          </button>
           <button className=" px-3 py-2  bg-slate-400" onClick={()=>setPlayingScreen(slotBookings[1])}>
           2
          </button>

            <button className=" px-3 py-2  bg-slate-400" onClick={()=>setPlayingScreen(slotBookings[2])}>
           3
          </button>
</div>
    </>
  );
};

export default AdScreen;