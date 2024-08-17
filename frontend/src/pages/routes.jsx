import { createBrowserRouter } from "react-router-dom";
import Home from "./home";
import Register from "./register";
import Group from "./group";
import PrivateLayout from "../components/private-layout";
import PostDetail from "./post/PostDetail";
import UserDetails from "./user/UserDetails";
import ConfigPage from "./config-page";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateLayout />,
    children: [
      { index: true, element: <Home /> },       
      { path: 'groups', element: <Group /> },   
      { path: '/register', element: <Register /> }, 
      { path: '/register', element: <Register /> },
      { path: 'post/:id', element: <PostDetail /> },
      { path: '/userdetail', element: <UserDetails /> }, 
      {path: 'config', element: <ConfigPage/>}
    ],
  },
]);

