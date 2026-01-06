import { createBrowserRouter } from "react-router";
// import Home_page from "@/pages/Home.page";
import RootLayout from "@/layouts/rootlayout";
// import Speaker_page from "@/pages/Speaker.page";
// import Programme_page from "@/pages/Programme.page";
// import Venue_page from "@/pages/Venue.page";
import AdminLayout from "@/layouts/adminlayout";
import GlobalDesign_page from "@/pages/GlobalDesign.page";
import HomeDesign_page from "@/pages/HomeDesign.page";
import ProgrammeDesign_page from "@/pages/ProgrammeDesign.page";
import SpeakersDesign_page from "@/pages/SpeakersDesign.page";
import VenueDesign_page from "@/pages/VenueDesign.page";
import ExhibitorsDesign_page from "@/pages/ExhibitorsDesign.page";
// import Exhibitors_page from "@/pages/Exhibitors.page";
import ProtectedRoute from "./ProtectedRoute";
import Profile_page from "@/pages/Profile.page";
import UsersProfile_page from "@/pages/UsersProfile.page";
import { ErrorBoundary } from "react-error-boundary";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import V2_rootlayout from "@/layouts/v2_rootlayout";
import V2_Home_page from "@/v2_pages/V2_Home.page";
import V2_Speakers_page from "@/v2_pages/V2_Speakers.page";
import V2_exhibitors_page from "@/v2_pages/V2_exhibitors.page";
import V2_Venue_page from "@/v2_pages/V2_Venue.page";
import V2_Programme_page from "@/v2_pages/V2_Programme.page";
import V2_VenueDesign_page from "@/v2_pages/V2_VenueDesign.page";

const Router = createBrowserRouter(
  [
    {
      path: "/",
      element: <V2_rootlayout />,
      children: [
        {
          index: true,
          element: <V2_Home_page />,
        },
        {
          path: "speaker",
          element: <V2_Speakers_page />,
        },
        {
          path: "programme",
          element: (
            <ErrorBoundary
              fallback={
                <ErrorDisplay
                  title="Something went wrong"
                  message="Oops!, Something went wrong. please wait for a while"
                />
              }
            >
              <V2_Programme_page />
            </ErrorBoundary>
          ),
        },
        {
          path: "venue",
          element: <V2_Venue_page />,
        },
        {
          path: "exhibitors",
          element: <V2_exhibitors_page />,
        },
        {
          path: "profile",
          element: (
            <ErrorBoundary
              fallback={
                <ErrorDisplay
                  title="Something went wrong"
                  message="Oops!, Something went wrong. please wait for a while"
                />
              }
            >
              <UsersProfile_page />,
            </ErrorBoundary>
          ),
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute element={<AdminLayout />} />,
      children: [
        {
          path: "global-design",
          element: <GlobalDesign_page />,
        },
        {
          path: "home-design",
          element: <HomeDesign_page />,
        },
        {
          path: "programme-design",
          element: <ProgrammeDesign_page />,
        },
        {
          path: "speakers-design",
          element: <SpeakersDesign_page />,
        },
        {
          path: "venue-design",
          element: <VenueDesign_page />,
        },
        {
          path: "exhibitors-design",
          element: <ExhibitorsDesign_page />,
        },
        {
          path:"venue-design/design-floor-plan",
          element:<V2_VenueDesign_page/>
        }
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute element={<RootLayout />} />,
      children: [
        {
          path: "wtc-profile",
          element: <Profile_page />,
        },
      ],
    },
    // {
    //   path: "/",
    //   element: <V2_rootlayout />,
    //   children: [
    //     {
    //       path: "Home_v2",
    //       element: <V2_Home_page />,
    //     },
    //     {
    //       path: "speakers_v2",
    //       element: <V2_Speakers_page />,
    //     },
    //     {
    //       path: "exhibitors_v2",
    //       element: <V2_exhibitors_page />,
    //     },
    //     {
    //       path: "venue_v2",
    //       element: <V2_Venue_page />,
    //     },
    //     {
    //       path: "programme_v2",
    //       element: <V2_Programme_page />,
    //     },
    //   ],
    // },
  ]
  // {
  //   basename: "/wtc/",
  // }
);

export default Router;
