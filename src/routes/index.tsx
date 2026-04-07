import { createBrowserRouter } from "react-router";
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
import V2_UserProfile_page from "@/v2_pages/V2_UserProfile.page";
import NewsDetail from "@/v2_pages/NewsDetail";
import SpeakerDetails from "@/v2_pages/SpeakerDetails";
import ExhibitorsDetails from "@/v2_pages/ExhibitorsDetails";
import AttachmentPdf from "@/v2_pages/AttachmentPdf";
import Auth_page from "@/v2_pages/Auth.page";
import Onboarding_page from "@/v2_pages/Onboarding.page";

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
        {
          path: "news/:id",
          element: <NewsDetail />,
        },
        {
          path: "speaker/:id",
          element: <SpeakerDetails />,
        },
        {
          path: "exhibitors/:id",
          element: <ExhibitorsDetails />,
        },
        {
          path: "attachment/:id",
          element: <AttachmentPdf />,
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute element={<AdminLayout />} adminOnly />,
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
          path: "venue-design/design-floor-plan/:id",
          element: <V2_VenueDesign_page />,
        },
        {
          path: "wtc-profile",
          element: <Profile_page />,
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute element={<V2_rootlayout />} />,
      children: [
        {
          path: "user-profile",
          element: <V2_UserProfile_page />,
        },
      ],
    },
    {
      path: "/auth",
      element: <Auth_page />,
    },
    {
      path: "/onboarding",
      element: <ProtectedRoute element={<Onboarding_page />} />,
    },
  ],
  // {
  //   basename: "/wtc/",
  // }
);

export default Router;
