import { createBrowserRouter } from "react-router";
import Home_page from "@/pages/Home.page";
import RootLayout from "@/layouts/rootlayout";
import Speaker_page from "@/pages/Speaker.page";
import Programme_page from "@/pages/Programme.page";
import Venue_page from "@/pages/Venue.page";

const Router = createBrowserRouter([
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
    ],
  },
]);

export default Router;
