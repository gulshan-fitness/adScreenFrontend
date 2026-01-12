




import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../Socket";
import { Context } from "../Context_holder";
import axios from "axios";

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
            "_id": "695f5a226ea747743cb7ec0a",
            "slot_id": "695f59616ea747743cb7ebfe",
            "screen_id": "69424ca896389f65937e0819",
            "screenOwner": "693bbd5b688f683288eaebb4",
            "advertiser_id": "693bb234688f683288eaeb9b",
            "start_datetime": "2026-01-12T06:11:00.000Z",
            "end_datetime": "2026-01-12T06:12:00.000Z",
            "duration_minutes": 1,
            "playedDuration": 0.9166666666666667,
            "price": 199.99,
            "adfiles": [
                "https://res.cloudinary.com/ddti3nlbr/image/upload/v1767856667/slotFiles/1767856672854_70_366421a.avif"
            ],
            "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK4SURBVO3BQY7cQAwEwSxC//9yeo88NSBIsx7TjIg/WGMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRrl4qEk/CaVkyR0Kl0SOpWTJPwmlSeKNUqxRinWKBcvU3lTEu5QOVF5QuVNSXhTsUYp1ijFGuXiw5Jwh8odSehUuiTcoXJHEu5Q+aRijVKsUYo1ysV/TmWSYo1SrFGKNcrFcCpdErokdCr/smKNUqxRijXKxYepfBOVLglPqHyTYo1SrFGKNcrFy5LwTZLQqTyRhG9WrFGKNUqxRrl4SOWbqXRJuEPlX1KsUYo1SrFGuXgoCZ1Kl4Q3qXQqXRJOVLoknCThTSqfVKxRijVKsUa5eFkSTlSeSEKn0ql0SbgjCZ1Kl4QTlS4JXRJOVJ4o1ijFGqVYo1y8TKVLwh1J+KQkdCp3qJwkoVPpktCpvKlYoxRrlGKNcvGyJJwkoVM5UemS0CWhUzlROUlCp3KShJMkdCpdEjqVJ4o1SrFGKdYoFx+m0iWhS8JJEk5UuiScJKFT6VS6JJyofJNijVKsUYo1ysVDKneovCkJJypdErok3KHSJeEOlU8q1ijFGqVYo8QfPJCE36RyRxI6lS4JnUqXhE7ljiScqLypWKMUa5RijXLxMpU3JeEkCScqXRJOktCpdEl4QqVLQqfyRLFGKdYoxRrl4sOScIfKEypdEjqVLgmdSpeEO1T+pmKNUqxRijXKxTBJ+CZJ6FQ6lTcVa5RijVKsUS6GUemS0CWhU+mScKJyh8pvKtYoxRqlWKNcfJjKJ6mcqNyhckcS7lD5pGKNUqxRijXKxcuS8JuScKLSJaFTuSMJJyonSehU3lSsUYo1SrFGiT9YYxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGuUPVTAL/JoFM/sAAAAASUVORK5CYII=",
            "redirectlink": "jsdbkjsdnk",
            "currency": "INR",
            "booking_status": "completed",
            "payment_status": "paid",
            "approved": true,
            "createdAt": "2026-01-08T07:17:54.757Z",
            "updatedAt": "2026-01-12T06:12:00.017Z",
            "__v": 0,
            "transaction_id": "69648f82ed5bfa8e6653f96d"
        },
        {
            "_id": "695f5a4f6ea747743cb7ec11",
            "slot_id": "695f59ea6ea747743cb7ec04",
            "screen_id":"694a3fb0016cf2323ae9b896",
            "screenOwner": "693bbd5b688f683288eaebb4",
            "advertiser_id": "693bb234688f683288eaeb9b",
            "start_datetime": "2026-01-12T06:10:00.000Z",
            "end_datetime": "2026-01-12T06:11:00.000Z",
            "duration_minutes": 1,
            "playedDuration": 0.75,
            "price": 300,
            "adfiles": [
                "https://res.cloudinary.com/ddti3nlbr/image/upload/v1767856710/slotFiles/1767856710523_460_web-development.png"
            ],
            "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK2SURBVO3BQW7sWAwEwSxC979yjpdcPUCQur/NYUT8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUuiS8SaVLwjepPFGsUYo1SrFGuXiZypuS8CaVJ1TelIQ3FWuUYo1SrFEuPiwJd6jcodIloVPpktCpPJGEO1Q+qVijFGuUYo1y8ccl4YkkdCp/WbFGKdYoxRrl4o9T6ZJwh8okxRqlWKMUa5SLD1P5zZLQqdyh8psUa5RijVKsUS5eloRvSkKn0iWhU+mScEcSfrNijVKsUYo1ysVDKr9JEjqVLgl3qPwlxRqlWKMUa5SLh5LQqXRJOFHpknCHykkSnkhCp3KShE6lS8KJyhPFGqVYoxRrlIsvU+mS0KmcJOEOlS4JJ0k4SUKncodKl4Q3FWuUYo1SrFHiD16UhDtUuiR8k8qbkvCEyhPFGqVYoxRrlIuXqZwk4Q6VkyScqHRJuCMJJyonKidJeFOxRinWKMUaJf7gg5LQqdyRhBOVkyR0Kl0SOpWTJJyo/EvFGqVYoxRrlPiDPywJJypdEjqVkyR0Kl0SnlB5U7FGKdYoxRrl4qEkfJPKiUqXhJMkdCqdSpeEJ1Q+qVijFGuUYo1y8TKVNyXhCZU3qXRJuCMJJypPFGuUYo1SrFEuPiwJd6jcodIloVM5ScIdKp1Kl4R/qVijFGuUYo1y8ccloVPpknCicpKELgmdyolKl4RO5U3FGqVYoxRrlIv/GZUuCZ3KicqJSpeETuWTijVKsUYp1igXH6bySSpPqHRJ6FROktCpdConSehUnijWKMUapVijXLwsCd+UhBOVNyWhUzlJQqfSqbypWKMUa5RijRJ/sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKf4lfE+VevTBkAAAAAElFTkSuQmCC",
            "redirectlink": "snkdnsk",
            "currency": "USD",
            "booking_status": "completed",
            "payment_status": "paid",
            "approved": true,
            "createdAt": "2026-01-08T07:18:39.652Z",
            "updatedAt": "2026-01-12T06:11:00.014Z",
            "__v": 0,
            "transaction_id": "69648f70ed5bfa8e6653f95f"
        }];




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

  const AddPlayingDuration = async (id,duration) => {
    console.log(id,duration,"....>>>");
     
   if(!id || !duration || duration <= 0) return;



      try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}addplayedDuration/${id}/${duration}`,
        {},
        {
          headers: {
            Authorization: usertoken
          }
        }
      );


      


    } catch (error) {
      
     
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
/* =========================
     HEARTBEAT - Every 5 seconds
========================== */
useEffect(() => {
  // 🛑 STOP if no active ad is playing
  if (!id || !PlayingScreen || !PlayingScreen._id) return


 



 const emitHeartbeat = () => {
  if (!PlayingScreen || !PlayingScreen?._id) return;
  
  // Make sure we're using the screen's _id, not the entire screen object
  const screenId = PlayingScreen.screen_id?._id || PlayingScreen.screen_id;
  
  socket.emit("screen_status", {
    screen_id: screenId, // This should be a string ID
    booking_id: PlayingScreen?._id,
    advertiser_id: PlayingScreen?.advertiser_id,
  });

  AddPlayingDuration(PlayingScreen?._id, 5);


  console.log("emitig every 5 sec.");
  
};

  // ⏱️ emit immediately
  emitHeartbeat();

  // ⏱️ then every 5 seconds
  const interval = setInterval(emitHeartbeat, 5000);

  return () => clearInterval(interval);
}, [PlayingScreen?._id]); // This will trigger when PlayingScreen changes to null





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


<div className=" absolute top-[100px] left-2 flex gap-2">

<button className="px-3 py-1 bg-slate-500"  onClick={()=>setPlayingScreen(slotBookings[0])}>

1
</button>
<button className="px-3 py-1 bg-slate-500" onClick={()=>setPlayingScreen(slotBookings[1])}>

2
</button>
<button className="px-3 py-1 bg-slate-500" onClick={()=>setPlayingScreen(slotBookings[2])}>

3
</button>
<button className="px-3 py-1 bg-slate-500" onClick={()=>setPlayingScreen(null)}>

null
</button>

</div>




      </div>
 
    </>
  );
};

export default AdScreen;