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
    if(appConfig.text_style){
      document.documentElement.style.setProperty(
        "--app-heading-1",
        appConfig.text_style.heading_1
      );
      document.documentElement.style.setProperty(
        "--app-heading-2",
        appConfig.text_style.heading_2
      )
      document.documentElement.style.setProperty(
        "--app-heading-3",
        appConfig.text_style.heading_3
      )
      document.documentElement.style.setProperty(
        "--app-normal-text",
        appConfig.text_style.all_other_text
      )
    }
  }, [appConfig]);

  return (
    <React.Fragment>
      <RouterProvider router={Router} />
    </React.Fragment>
  );
}

export default App;
