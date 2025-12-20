



import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../Context_holder";
import { useParams, useSearchParams } from "react-router-dom";
import { HiLightBulb } from "react-icons/hi";



export default function RiddlesPlay() {


  const { usertoken, notify,AllRiddles,Riddles,RiddlesFetch,
     user } = useContext(Context);

  const [step, setStep] = useState(true); // 'chooseType' or 'play'
  const [type, setType] = useState("");
  const [currentRiddle,setcurrentRiddle]=useState(null)
   const [ShowClue,setShowClue]=useState(false)

  const [riddleCount, setRiddleCount] = useState(0);

  const [guess, setGuess] = useState("");

  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  console.log(attempts,"attempts");
  

  
const [searchParams, setSearchParams] = useSearchParams();

const riddelScoreSubmit=(ans)=>{
  if(!user ||!currentRiddle) return
const score={
   user_id:user?._id,
  
    
    Riddle_id:currentRiddle?._id,
  
  
    score: ans,
  
}


    axios
        .post(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_RIDDLESCORE_URL="riddlescore/"
}add`,
          score,
          {
            headers: {
              Authorization: usertoken,
            },
          }
        )
        .then(success => {
          notify(success.data.msg, success.data.status);
  
        
        })
        .catch(error => {});
}


 
useEffect(
  ()=>{

const Query={}

if( type!==""){

  Query.type=type
  setSearchParams(Query)
RiddlesFetch(null,window.location.search)

}

else setSearchParams()


  },

  [type]
)
 

useEffect(()=>{


// console.log(AllRiddles,"AllRiddles")

if(AllRiddles.length!==0) setStep(false) 



}, [AllRiddles])


useEffect(
  ()=>{
    setcurrentRiddle(AllRiddles[riddleCount])
  }
  ,
  
  [riddleCount,AllRiddles]
)


useEffect(
  ()=>{
   if(attempts==3){
    setShowAnswer(true)
    riddelScoreSubmit(0)
   
   }
  }
  ,
  
  [attempts]
)





  const handleTypeSelect = (selectedType) => {
    setType(selectedType);

  };

  const handleGuess = () => {
    console.log(usertoken,currentRiddle);
    
    if(!currentRiddle ||!usertoken ) return

    else if(!guess){ 

      notify("please fill the Answer",0)

    }

    else{

       axios
          .post(
            `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_RIDDLES_URL}answerVerify/${currentRiddle?._id}/${guess}`,
            
            {
              headers: {
                Authorization: usertoken,
              },
            }
          )
          .then((success) => {
            notify(success.data.msg, success.data.status);
    
            if (success.data.status === 1) {

             setGuess("")
              setShowAnswer(true)
              
             riddelScoreSubmit(1)
            }

            else{

              setAttempts(attempts+1)


               

             

            }
          })
          .catch((error) => {
            notify(error.message, 0);
          });
        
        }
   
  };


  console.log(riddleCount,AllRiddles,AllRiddles?.length-1);
  
  return (
    <div className="min-h-screen bg-[#0C0C0C] p-6 w-full  text-white  font-sans 
   ">

      {step && (
        <div className="bg-[#1A1A1A] w-full fixed top-0 left-0 p-8 rounded-2xl border border-[#333333] shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-6 text-[#FFD700]">Choose Riddle Type</h2>
          <div className="flex flex-col gap-4">
            {["easy", "hard", "very hard"].map((t) => (
              <button
                key={t}
                onClick={() => handleTypeSelect(t)}
                className="bg-[#FFD700] text-black py-2 px-4 rounded hover:brightness-110 transition"
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {!step  && currentRiddle && (
        <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-[#333333] shadow-lg  w-full">

           <p className="mt-2 text-sm text-[#888] text-center">Attempts: {attempts} / 3</p>
          <h2 className="text-xl font-bold mb-4 text-[#FFD700]">Riddle</h2>
        
          <p className="mb-4 font-semibold text-center text-4xl">{ currentRiddle.question}</p>
          

        

          {!showAnswer ? (
            <>

              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter your guess"
                className="w-full px-4 py-2 rounded bg-[#0C0C0C] border border-[#333333] text-[#F5DEB3] placeholder:text-[#888]"
              />

              <button
                onClick={handleGuess}
                className="w-full mt-4 bg-[#FFD700] text-black py-2 rounded hover:brightness-110 transition"
              >
                Submit
              </button>

              {
                !ShowClue ?(
<button className=" flex justify-center gap-2 items-center mt-9" onClick={()=>setShowClue(true)}> <HiLightBulb className="text-4xl text-gray-300c"/> 

<span className="font-semibold text-3xl">Show Me Clue</span>  

</button>

                ):
                (
 <p className="mb-4 text-2xl font-semibold   mt-9">Clue: {currentRiddle.clue}</p>
                )
              }
             


               
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-lg font-bold">Answer:</p>


                <p className="text-xl font-semibold text-[#0ff70f]">{currentRiddle?.answer}</p>
               
               
               {
              riddleCount<AllRiddles?.length-1?(   
               
               <button
                  onClick={() => {
                  
                    setAttempts(0);

                    setShowAnswer(false);

                    setGuess("");

                  

                    if(riddleCount<AllRiddles?.length-1){

 setRiddleCount(riddleCount + 1)

                    }
                
                
                  }}
                  className="mt-4 bg-[#FFD700] text-black py-2 px-4 rounded hover:brightness-110 transition"
                >
               Next
                </button>):(
  <button
                  onClick={() => {
                  
          setType("")
          setStep(true)
            setAttempts(0);
            setShowAnswer(false);
            setGuess("");
                
                
                  }}
                  className="mt-4 bg-[#FFD700] text-black py-2 px-4 rounded hover:brightness-110 transition"
                >
               Play Again
                </button>
                )
               } 
               
            


              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
