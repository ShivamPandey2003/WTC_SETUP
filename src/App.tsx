import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import Router from "./routes";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";

function App() {
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice
  );

  useEffect(() => {
    if (appConfig.color_schema) {
      document.documentElement.style.setProperty(
        "--app-primary-color",
        appConfig.color_schema.primary_color
      );
      document.documentElement.style.setProperty(
        "--app-secondary-color",
        appConfig.color_schema.secondary_color
      );
    }
  }, [appConfig]);

  return (
    <React.Fragment>
      <RouterProvider router={Router} />
    </React.Fragment>
  );
}

export default App;
