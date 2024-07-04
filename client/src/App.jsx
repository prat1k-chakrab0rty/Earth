import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles.css";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Info from "./pages/Info";
import Call from "./pages/Call";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:
        <Home />
      ,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/chat",
      element: <Chat />,
    },
    {
      path: "/call",
      element: <Call />,
    },
    {
      path: "/info",
      element: <Info />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
