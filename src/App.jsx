import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import UserSignUp from "./UserSignUp";
import UserLogin from "./UserLogin";
import UserProfile from "./UserProfile/UserProfile";
import AdminProfile from "./Admin/AdminProfile";
import Admin_login from "./Admin/Admin_login";
import Admin_sign_up from "./Admin/Admin_sign_up";
import { Suspense, useContext, useEffect } from "react";


import Dashboard from "./Admin/Dashboard";
import SSM from "./SSM";
import CrosswordPuzzleAdd from "./CrosswordPuzzle/CrosswordPuzzleAdd";
import UserProtectedRouts from "./User/UserProtectedRouts";
import AdminProtectedRoutes from "./Admin/AdminProtectedRoutes";

import { Context } from "./Context_holder";

import CrosswordPuzzlePlay from "./CrosswordPuzzle/CrosswordPuzzlePlay";
import CrosswordPuzzleList from "./CrosswordPuzzle/CrosswordPuzzleList";
import SudokoAdd from "./Sudoko/SudokoAdd";
import SudokoListAdmin from "./Sudoko/SudokoListAdmin";
import SudokoListPlay from "./Sudoko/SudokoListPlay";
import SudokoPlay from "./Sudoko/SudokoPlay";
import CrosswordPuzzleAdminList from "./CrosswordPuzzle/CrosswordPuzzleAdminList";
import CrosswordPuzzleEdit from "./CrosswordPuzzle/CrosswordPuzzleEdit";
import SudokoEdit from "./Sudoko/SudokoEdit";
import RiddleQuiz from "./Riddels/RiddelsPlay";

import TopScroll from "./TopScroll";

import RiddlesAdd from "./Admin/Riddles/RiddlesAdd";
import RiddlesView from "./Admin/Riddles/RiddlesView";
import MatchstickMathPuzzle from "./MatchstickMathPuzzle/MatchstickMathPuzzlePlay";
import DragAndDrop from "./DragAndDrop";
import MatchstickMathPuzzleAdd from "./Admin/MatchstickMathPuzzle/MatchstickMathPuzzleAdd";
import MatchstickMathPuzzlePlay from "./MatchstickMathPuzzle/MatchstickMathPuzzlePlay";
import UserLive from "./UserLive";
import MatchisickPuzzleList from "./MatchstickMathPuzzle/MatchisickPuzzleList";
import MatchistickMathPuzzleView from "./Admin/MatchstickMathPuzzle/MatchistickMathPuzzleView";
import MatchistickMathPuzzleEdit from "./Admin/MatchstickMathPuzzle/MatchistickMathPuzzleEdit";
import RiddlesEdit from "./Admin/Riddles/RiddlesEdit";
import UserList from "./User/UserList";
import Contact from "./Contact";
import About from "./About";
import AdScreenAdd from "./User/AdScreenAdd";
import DashboardOverview from "./UserProfile/DashboardOverview";
import ProfileDetails from "./UserProfile/ProfileDetails";
import Wallet from "./User/Wallet";
import SlotCreationComponent from "./User/SlotCreationForm";
import SlotBooking from "./User/SlotBooking";
import MyBookingsPage from "./SlotBooking/BookingList";
import AdScreen from "./AdScreen/AdScreen";
import AdScreenList from "./User/AdScreenList";
import ScreenStatus from "./User/ScreenStatus";



function App() {
  const { setadmin, setadminToken, setuser, setusertoken, setIsScrolled } =
    useContext(Context);

  const stored_admin = JSON.parse(localStorage.getItem("admin"));

  const stored_admin_token = localStorage.getItem("admin_token");

  const stored_user = JSON.parse(localStorage.getItem("user"));

  const stored_usertoken = localStorage.getItem("usertoken");

  useEffect(() => {
    if (stored_admin) {
      setadmin(stored_admin);
    }

    if (stored_admin_token) {
      setadminToken(stored_admin_token);
    }
    if (stored_user) {
      setuser(stored_user);
    }

    if (stored_usertoken) {
      setusertoken(stored_usertoken);
    }
  }, []);

  const Loading=()=> {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#17412D]" />
    </div>
  );
}

  



  const routes = createBrowserRouter([
    {
      path: "/",
      element: 
      <>
      <TopScroll/>
      <Home />
      </>
      ,

      children: [
        
        {
          path: "",
          element: <SSM />,
        },


        {
          path: "adscreen/:id",
          element: <AdScreen />,
        },




        {
          path: "/usersignup",
          element: <UserSignUp />,
        },

        {
          path: "/userlogin",
          element: <UserLogin />,
        },

        {
          path: "/adminloginitslocked",
          element: <Admin_login />,
        },


           {
          path: "/contact",
          element: <Contact />,
        },

             {
          path: "/about",
          element: <About />,
        },
        {
          path: "/adminsignupitslocked",

          element: <AdminProtectedRoutes>
          <Admin_sign_up />
      </AdminProtectedRoutes>
          
          
        },

        
        {
          path: "/crosswordpuzzle/:id",
          element: (

            <UserProtectedRouts>
<CrosswordPuzzlePlay />
            </UserProtectedRouts> 
        ),
        },

          {
          path: "/crosswordpuzzle",
          element: (
            <UserProtectedRouts>
<CrosswordPuzzleList />
            </UserProtectedRouts> 

        ),
        },

            {
          path: "/sudoko",
          element: (

            <UserProtectedRouts>
<SudokoListPlay />
            </UserProtectedRouts> 
        ),
        },

        
            {
          path: "/Riddles",
          element: (

            <UserProtectedRouts>
<RiddleQuiz />
            </UserProtectedRouts> 
        ),
        },


         {
          path: "/sudoko/:id",
          element: (

            <UserProtectedRouts>
<SudokoPlay/>
            </UserProtectedRouts> 
        ),
        },

         {
          path: "/matchstickpuzzle/:id",
          element: (

            <UserProtectedRouts>

<MatchstickMathPuzzlePlay/>

            </UserProtectedRouts> 
        ),
        },

          {
          path: "/matchstickpuzzleLevels",
          element: (
          <UserProtectedRouts>

<MatchisickPuzzleList/>

      </UserProtectedRouts> 
        ),
        },


          {
          path: "/drag",
          element: (

            <UserProtectedRouts>

<DragAndDrop/>

            </UserProtectedRouts> 
        ),
        },

      ],
    },

   // In your main router configuration (e.g., App.jsx or router.jsx)
{
  path: "/userprofile",
  element: (
    <UserProtectedRouts>
      <UserProfile />
    </UserProtectedRouts>
  ),
  children: [
    {
      path: "",
      element: <DashboardOverview /> // Default/overview page
    },



    

       {
      path: "onlinescreens",
      element: <ScreenStatus />
    },
    {
      path: "overview",
      element: <DashboardOverview />
    },
    {
      path: "profile",
      element: <ProfileDetails />
    },

      {
      path: "playads",
      element: <AdScreenList />
    },
    {
      path: "findscreens",
      element: <SlotBooking />
    },

      {
      path: "bookinglist",
      element: <MyBookingsPage />
    },


 
    // {
    //   path: "campaigns",
    //   element: <MyCampaigns />
    // },
    {
      path: "wallet",
      element: <Wallet />
    },
    // {
    //   path: "bookings",
    //   element: <BookedSlots />
    // },
    
    {
      path: "screens/add",
      element: <AdScreenAdd />
    },
    // {
    //   path: "tracking",
    //   element: <LiveTracking />
    // },
    // {
    //   path: "history",
    //   element: <PaymentHistory />
    // },
    // {
    //   path: "settings",
    //   element: <Settings />
    // },
    // // Add screen owner specific routes
    // {
    //   path: "screens/add",
    //   element: <MyScreens />
    // },
    {
      path: "slots/add",
      element: <SlotCreationComponent/>
    },


    // {
    //   path: "location",
    //   element: <LocationSetup />
    // },
    // {
    //   path: "player",
    //   element: <ScreenPlayer />
    // },
    // {
    //   path: "pricing",
    //   element: <Pricing />
    // },
    // {
    //   path: "analytics",
    //   element: <Analytics />
    // }
  ]
},


     {


      path: "/edituserprofile",
      element: (
        <UserProtectedRouts>
                 <UserSignUp />
              </UserProtectedRouts>
  )
    },


  //        {


  //     path: "/paymentui",
  //     element: (
  //       <UserProtectedRouts>
  //                <YourComponent />
  //             </UserProtectedRouts>
  // )
  //   },

    {
      path: "/adminprofile",
      element: (
      <AdminProtectedRoutes>
        <AdminProfile />
      </AdminProtectedRoutes>
      ),

      children: [
        {
          path: "",
          element: <Dashboard />,
        },
           {
          path: "crosswordpuzzle/add",
          element: <CrosswordPuzzleAdd />,
        },
        {
          path: "crosswordpuzzle/view",
          element: <CrosswordPuzzleAdminList/>,
        },
           {
          path: "crosswordpuzzle/edit/:id",
          element: <CrosswordPuzzleEdit/>,
        },

        {
          path: "sudoko/add",
          element: <SudokoAdd />,
        },
        
        {
          path: "sudoko/view",
          element: <SudokoListAdmin />,
        },

      {
          path: "sudoko/edit/:id",
          element: <SudokoEdit/>,
        },

           {
          path: "usersList",
          element: <UserList/>,
        },

        


        {
          path: "riddles/add",
          element: <RiddlesAdd />,
        },
             {
          path: "riddles/view",
          element: <RiddlesView />,
        },
             {
          path: "riddles/edit/:id",
          element: <RiddlesEdit/>,
        },



              {
          path: "matchstickpuzzle/add",
          element: <MatchstickMathPuzzleAdd />,
        },
             {
          path: "matchstickpuzzle/view",
          element: <MatchistickMathPuzzleView />,
        },
             {
          path: "matchstickpuzzle/edit/:id",
          element: <MatchistickMathPuzzleEdit/>,
        },
        
        
      ],
    },


    
  ]);
  <>
  
  </>

  return (

     <Suspense fallback={<Loading />}>

      <RouterProvider  router={routes} />

    </Suspense>
 
);
}

export default App;
