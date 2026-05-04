import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import Router from "./routes";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";

function App() {
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );

  useEffect(() => {
    const isFirstLoad = !localStorage.getItem("app_initialized");

    if (isFirstLoad) {
      // -------- Clear local/session storage --------
      localStorage.clear();
      sessionStorage.clear();

      // -------- Clear cookies --------
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      });

      // -------- Clear IndexedDB --------
      if ("indexedDB" in window) {
        indexedDB.databases?.().then((dbs: any) => {
          dbs.forEach((db: any) => {
            if (db.name) indexedDB.deleteDatabase(db.name);
          });
        });
      }

      // mark as initialized
      localStorage.setItem("app_initialized", "true");
    }
  }, []);

  useEffect(() => {
    if (!appConfig) return;

    if (appConfig.color_schema) {
      document.documentElement.style.setProperty(
        "--app-primary-color",
        appConfig.color_schema.primary_color ?? "#318061",
      );
      document.documentElement.style.setProperty(
        "--app-secondary-color",
        appConfig.color_schema.secondary_color ?? "#D6E6DF",
      );
    }
    if (appConfig.text_style) {
      document.documentElement.style.setProperty(
        "--app-heading-1",
        appConfig.text_style.heading_1,
      );
      document.documentElement.style.setProperty(
        "--app-heading-2",
        appConfig.text_style.heading_2,
      );
      document.documentElement.style.setProperty(
        "--app-heading-3",
        appConfig.text_style.heading_3,
      );
      document.documentElement.style.setProperty(
        "--app-normal-text",
        appConfig.text_style.all_other_text,
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
