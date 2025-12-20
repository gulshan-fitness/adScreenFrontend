import axios from "axios";
import React, { createContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MdDashboard,
  MdGridOn,
  MdFunctions,
  MdAdd,
  MdVisibility,
  MdQuestionAnswer,
  MdExtension,
  MdCalculate,
  MdSmartToy
} from 'react-icons/md';


const Context = createContext();

export default function Context_holder(props) {
  const [user, setuser] = useState(null);

  const [usertoken, setusertoken] = useState("");
  const [UserLoginPopUp, setUserLoginPopUp] = useState(false);
  const [admin, setadmin] = useState(null);
  const [adminToken, setadminToken]=useState("");

  const [UserSignUpPopUp, setUserSignUpPopUp] = useState(false);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const [CrosswordPuzzle, setCrosswordPuzzle]=useState(null);

  const [AllCrosswordPuzzle, setAllCrosswordPuzzle] = useState(null);

  const [userGrid, setUserGrid] = useState([]);

  const [CrosswordPuzzleScore_id, setCrosswordPuzzleScore_id] = useState(null);

  const [CrosswordPuzzlePreviousScore, setCrosswordPuzzlePreviousScore] =
    useState(null);



const [AllSudoko, setAllSudoko] = useState([]);

const [Sudoko, setSudoko] = useState(null);

const [AllRiddles, setAllRiddles] = useState([]);

const [Riddles, setRiddles] = useState(null);

const [AllMatchistickPuzzles, setAllMatchistickPuzzles] = useState([]);

const [MatchistickPuzzles, setMatchistickPuzzles] = useState(null);

const [MatchistickPuzzleScore, setMatchistickPuzzleScore] = useState(null);
const [UsersList, setUsersList] = useState([]);
const [Top10Users, setTop10Users] = useState([]);

const [MatchistickCounts, setMatchistickCounts] = useState(null);







  const notify = (msg, status) => {
    toast(msg, {
      position: "top-right",
      type: status === 1 ? "success" : "error",
    });
  };

  const logout_handler = () => {

    localStorage.removeItem("user");

    setuser(null);

    localStorage.removeItem("usertoken");

    setusertoken("");
    
  };

  const CrosswordPuzzleFetch = (id, user_id) => {
    let api=`${import.meta.env.VITE_API_BASE_URL}${
      import.meta.env.VITE_CROSSWORDPUZZLE_URL
    }read`;

     if (id) {
      api += `/${id}`;
    }

     if(user_id){
          api += `/${user_id}`;
    }

    axios
      .get(api)

      .then((success) => {
        if (success.data.status == 1) {
          const data = success.data.Crosswordpuzzle;

          if (id) {
            setCrosswordPuzzle(data[0]);

            if (data[0].userScore) {
              setUserGrid(data[0].userScore.answersGrid || []);
              setCrosswordPuzzleScore_id(data[0].userScore._id);
              setCrosswordPuzzlePreviousScore(data[0].userScore.currentScore);
            } else {
              setUserGrid([]);
              setCrosswordPuzzleScore_id(null);
              setCrosswordPuzzlePreviousScore(null);
            }
          } else {
            setAllCrosswordPuzzle(data);
          }
        }
      })

      .catch((error) => {});
  };

  const SudokoFetch = (id, user_id) => {
   

    let api = `${import.meta.env.VITE_API_BASE_URL}${
      import.meta.env.VITE_SUDOKO_URL
    }read`;

    if (id) {
      api += `/${id}`;
    }
     if(user_id){
          api += `/${user_id}`;
    }

    axios
      .get(api)

      .then((success) => {
        if (success.data.status == 1) {
          const data = success.data.Sudoko;

          if (id) {
            setSudoko(data[0]);

           
          }

      
          else {
            setAllSudoko(data);
          }
        }
      })

      .catch((error) => {});
  };

    const RiddlesFetch = (id, query) => {
   

    let api =`${import.meta.env.VITE_API_BASE_URL}${
      import.meta.env.VITE_RIDDLES_URL
    }read`;

    if (id) {
      api += `/${id}`;
    }

     if(query){

          api += `${query}`;

    }


    axios.get(api)

      .then((success) => {
        if (success.data.status == 1) {

          const data=success.data.Riddles;

          if (id) {
            setRiddles(data);
          }

      
          else {

            setAllRiddles(data);

          }
        }
      })

      .catch((error) => {});
  };




      const MatchistickPuzzleFetch = (id, query) => {
   

    let api =`${import.meta.env.VITE_API_BASE_URL}${
      import.meta.env.VITE_MATCHSTICKPUZZLE_URL
    }read`;

    if (id) {
      api += `/${id}`;
    }

     if(query){

          api += `${query}`;

    }


    axios.get(api)

      .then((success) => {
        if (success.data.status == 1) {

          const data=success.data.MatchstickMathPuzzle;


          if (id) {
            setMatchistickPuzzles(data);
          }

      
          else {

            setAllMatchistickPuzzles(data);

          }
        }
      })

      .catch((error) => {});
  };

        const MatchistickPuzzletotalcountFetch = () => {
   

    let api =`${import.meta.env.VITE_API_BASE_URL}${
      import.meta.env.VITE_MATCHSTICKPUZZLE_URL
    }totalcount`;

    axios.get(api)

      .then((success) => {
        if (success.data.status == 1) {

          const data=success.data.TotalCounts;

setMatchistickCounts(data)
     
        }
      })

      .catch((error) => {});
  };

  


        const MatchistickPuzzleScoreFetch = (id) => {
   

    let api =`${import.meta.env.VITE_API_BASE_URL}${
      import.meta.env.VITE_MATCHISTICKSCORESCORE_URL
    }read`;

    if (id) {
      api += `/${id}`;
    }

     


    axios.get(api)

      .then((success) => {
        if (success.data.status == 1) {

          const data=success.data.MatchistickScore;

            setMatchistickPuzzleScore(data);

        }
      })

      .catch((error) => {});
  };

         const UsersFetch = (id) => {
   

    let api =`${import.meta.env.VITE_API_BASE_URL}${
      import.meta.env.VITE_USER_URL
    }/read` ;
    
    if (id) {
      api += `/${id}`;
    }

     


    axios.get(api)

      .then((success) => {

        if (success.data.status == 1) {

          const data=success.data.user;

            setUsersList(data);

        }


      })

      .catch((error) => {});
  };


           const Top10StudentsFetch = () => {
   

    let api =`${import.meta.env.VITE_API_BASE_URL}${
      import.meta.env.VITE_USER_URL
    }/top10User` ;
    
   

     


    axios.get(api)

      .then((success) => {

        if (success.data.status == 1) {

          const data=success.data.topStudents;

            setTop10Users(data);

        }


      })

      .catch((error) => {});
  };





  const FetchApi = async (
    baseUrl,
    subPath,
    path,
    params,
    body,
    query,
    token
  ) => {
    try {
      const Body_Data = body ?? {};
  
      const HeadersQuery = token
        ? { Authorization: token }
        : {};
  
      let api = `${baseUrl || import.meta.env.VITE_API_BASE_URL}${subPath}${path}`;
  
      if (params) api += `/${params}`;
      if (query) api += `?${query}`;
  
      const res = await axios.post(
        api,
        Body_Data,               // ✅ BODY
        { headers: HeadersQuery } // ✅ HEADERS (CORRECT PLACE)
      );
  
      if (res.data.status === 1) {
        return res.data.data;
      } else {
        return null;
      }
    } catch (error) {
      return {
        status: 0,
        msg: error.response?.data?.msg || "Something went wrong",
      };
    }
  };
  


const getCurrencySymbol = (code = "") => {
  const currencyMap = {
    INR: "₹",   // Indian Rupee
    USD: "$",   // US Dollar
    EUR: "€",   // Euro
    GBP: "£",   // British Pound
    SGD: "$",   // Singapore Dollar
    AUD: "$",   // Australian Dollar
    CAD: "$",   // Canadian Dollar
    AED: "د.إ", // UAE Dirham
    JPY: "¥",   // Japanese Yen
  };

  return currencyMap[code.toUpperCase()] ?? "";
};

  
  



const menu_links = [
  {
    name: "Dashboard",
    url: "",
    icon: <MdDashboard className="text-xl" />,
  },
  {
    name: "Crossword Puzzle",
    url: null,
    icon: <MdGridOn className="text-xl" />,
    subitems: [
      { name: "Add", url: "crosswordpuzzle/add", icon: <MdAdd /> },
      { name: "View", url: "crosswordpuzzle/view", icon: <MdVisibility /> },
    ],
  },
  {
    name: "Sudoku",
    url: null,
    icon: <MdCalculate className="text-xl" />,
    subitems: [
      { name: "Add", url: "sudoko/add", icon: <MdAdd /> },
      { name: "View", url: "sudoko/view", icon: <MdVisibility /> },
    ],
  },
  {
    name: "Riddles",
    url: null,
    icon: <MdQuestionAnswer className="text-xl" />,
    subitems: [
      { name: "Add", url: "riddles/add", icon: <MdAdd /> },
      { name: "View", url: "riddles/view", icon: <MdVisibility /> },
    ],
  },
  {
    name: "Matchstick Puzzle",
    url: null,
    icon: <MdSmartToy className="text-xl" />,
    subitems: [
      { name: "Add", url: "matchstickpuzzle/add", icon: <MdAdd /> },
      { name: "View", url: "matchstickpuzzle/view", icon: <MdVisibility /> },
    ],
  },
];

  return (
    <Context.Provider
      value={{
        UserLoginPopUp,
        setUserLoginPopUp,
        UserSignUpPopUp,
        setUserSignUpPopUp,
        user,
        setuser,
        usertoken,
        setusertoken,
        notify,
        isMobileMenuOpen,
        setMobileMenuOpen,
        isScrolled,
        setIsScrolled,
        logout_handler,
        admin,
        setadmin,
        adminToken,
        setadminToken,
        menu_links,
        CrosswordPuzzle,
        setCrosswordPuzzle,
        CrosswordPuzzleFetch,
        userGrid,
        setUserGrid,
        CrosswordPuzzleScore_id,
        setCrosswordPuzzleScore_id,
        CrosswordPuzzlePreviousScore,
        setCrosswordPuzzlePreviousScore,
        AllCrosswordPuzzle,
        setAllCrosswordPuzzle,
        Sudoko,
        setSudoko,
        AllSudoko,
        setAllSudoko,
        SudokoFetch,AllRiddles, setAllRiddles,Riddles, setRiddles,RiddlesFetch,MatchistickPuzzleFetch,AllMatchistickPuzzles,setAllMatchistickPuzzles,  MatchistickPuzzles,setMatchistickPuzzles,setMatchistickPuzzleScore,MatchistickPuzzleScore,MatchistickPuzzleScoreFetch,UsersFetch,UsersList,setUsersList,Top10Users, setTop10Users,Top10StudentsFetch,setMatchistickCounts,MatchistickCounts,MatchistickPuzzletotalcountFetch,





        FetchApi,getCurrencySymbol
      }}
    >
      {props.children}

      <ToastContainer />
    </Context.Provider>
  );
}

export { Context };
