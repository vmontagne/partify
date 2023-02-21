import React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Home } from "./home/home"
import { Search } from "./search/search"
import { Album } from "./album/album"
import { Artist } from "./artist/artist"
import { useServer } from "./utils/server"
import "./App.css"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/album",
    element: <Album />,
  },
  {
    path: "/artist",
    element: <Artist />,
  },
])

function App() {
  useServer()
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  )
}

export default App
