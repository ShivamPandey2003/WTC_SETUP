import React from "react"
import { RouterProvider } from "react-router"
import Router from "./routes"


function App() {

  return (
    <React.Fragment>
      <RouterProvider router={Router}/>
    </React.Fragment>
  )
}

export default App
