import { createBrowserRouter } from "react-router";
import Home_page from "@/pages/Home.page";
import RootLayout from "@/layouts/rootlayout";
import Speaker_page from "@/pages/Speaker.page";
import Programme_page from "@/pages/Programme.page";
import Venue_page from "@/pages/Venue.page";
import AdminLayout from "@/layouts/adminlayout";
import GlobalDesign_page from "@/pages/GlobalDesign.page";
import HomeDesign_page from "@/pages/HomeDesign.page";
import ProgrammeDesign_page from "@/pages/ProgrammeDesign.page";
import SpeakersDesign_page from "@/pages/SpeakersDesign.page";
import VenueDesign_page from "@/pages/VenueDesign.page";
import ExhibitorsDesign_page from "@/pages/ExhibitorsDesign.page";
import Exhibitors_page from "@/pages/Exhibitors.page";
import ProtectedRoute from "./ProtectedRoute";
import Profile_page from "@/pages/Profile.page";

const Router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home_page />,
        },
        {
          path: "speaker",
          element: <Speaker_page />,
        },
        {
          path: "programme",
          element: <Programme_page />,
        },
        {
          path: "venue",
          element: <Venue_page />,
        },
        {
          path: "exhibitors",
          element: <Exhibitors_page />,
        },
      ],
    },
    {
      path:"/",
      element:<ProtectedRoute element={<AdminLayout/>}/>,
      children:[
        {
          path:"global-design",
          element:<GlobalDesign_page/>
        },
        {
          path:"home-design",
          element:<HomeDesign_page/>
        },
        {
          path:"programme-design",
          element:<ProgrammeDesign_page/>
        },
        {
          path:"speakers-design",
          element:<SpeakersDesign_page/>
        },
        {
          path:"venue-design",
          element:<VenueDesign_page/>
        },
        {
          path:"exhibitors-design",
          element:<ExhibitorsDesign_page/>
        }
      ]
    },
    {
      path:'/',
      element:<ProtectedRoute element={<RootLayout/>}/>,
      children:[
        {
          path:'profile',
          element:<Profile_page/>
        }
      ]
    }
  ],
  // {
  //   basename: "/wtc/",
  // }
);

export default Router;
