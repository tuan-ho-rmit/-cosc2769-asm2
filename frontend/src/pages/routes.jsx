import { createBrowserRouter } from "react-router-dom";
import Home from "./home";
import Register from "./register";
import Login from "./login";
import Group from "./group";
import PrivateLayout from "../components/private-layout";
import PostDetail from "./post/PostDetail";
import UserDetails from "./user/UserDetails";
import ConfigPage from "./config-page";
import CreateGroup from "./group/creategroup";
import ManageGroup from "./managegroup";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateLayout />,
    children: [
      { index: true, element: <Home /> },       
      { path: 'groups', element: <Group /> },   
      { path: '/creategroup', element: <CreateGroup /> }, 
      { path: '/managegroup', element: <ManageGroup /> }, 
      { path: '/register', element: <Register /> }, 
      { path: '/login', element: <Login /> }, 
      { path: '/register', element: <Register /> },
      { path: 'post/:id', element: <PostDetail /> },
      { path: '/userdetail', element: <UserDetails /> },
      {path: 'config', element: <ConfigPage/>}
    ],
  },
]);

