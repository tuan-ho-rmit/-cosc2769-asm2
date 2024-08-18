import { createBrowserRouter } from "react-router-dom";
import Home from "./home";
import Register from "./register";
import Login from "./login";
import Group from "./group";
import PrivateLayout from "../components/private-layout";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateLayout />,
    children: [
      { index: true, element: <Home /> },       
      { path: '/group', element: <Group /> },   
      { path: '/register', element: <Register /> }, 
      { path: '/login', element: <Login /> }, 
    ],
  },
]);

