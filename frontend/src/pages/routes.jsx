import { Navigate, createBrowserRouter } from "react-router-dom";
import Home from "./home";
import Register from "./register";
import Login from "./login";
import Group from "./group";
import PrivateLayout from "../components/private-layout";
import PostDetail from "./post/PostDetail";
import MyDetails from "./user/MyDetails";
import UserDetails from "./user/UserDetails";
import ConfigPage from "./config-page";
import CreateGroup from "./group/creategroup";
import ManageGroup from "./managegroup";
import Admin from "./admin";
import AdminUsers from "./admin/components/users";
import AdminGroups from "./admin/components/groups";
import AdminPosts from "./admin/components/posts";
import DiscoverGroup from "./discovergroup";
import GroupMemberManagement from "./groupmembermanagement";
import GroupMain from "./groupmain";
import ProtectedRoute from "../components/protectedRoute";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateLayout />,
    children: [
      { index: true, element: <ProtectedRoute element={<Home />} /> },
      { path: 'groups', element: <ProtectedRoute element={<Group />} /> },
      { path: 'creategroup', element: <ProtectedRoute element={<CreateGroup />} /> },
      { path: 'managegroup', element: <ProtectedRoute element={<ManageGroup />} /> },
      { path: 'discovergroup', element: <ProtectedRoute element={<DiscoverGroup />} /> },
      { path: 'groupmembermanagement/:groupName', element: <ProtectedRoute element={<GroupMemberManagement />} /> },
      { path: 'groupmain/:groupId', element: <ProtectedRoute element={<GroupMain />} /> },
      { path: 'register', element: <Register /> },  // Register 페이지는 보호하지 않음
      { path: 'login', element: <Login /> },        // Login 페이지는 보호하지 않음
      { path: 'post/:id', element: <ProtectedRoute element={<PostDetail />} /> },
      { path: 'mydetail', element: <ProtectedRoute element={<MyDetails />} /> },
      { path: 'user/:userId', element: <ProtectedRoute element={<UserDetails />} /> },
      { path: 'config', element: <ProtectedRoute element={<ConfigPage />} /> },
      {
        path: "/admin",
        element: <ProtectedRoute element={<Navigate to="/admin/users" />} />,
      },
      {
        path: 'admin', element: <ProtectedRoute element={<Admin />} />, children: [
          { path: "users", element: <AdminUsers />, name: "Users" },
          { path: "groups", element: <AdminGroups />, name: "Groups" },
          { path: "posts", element: <AdminPosts />, name: "Posts" },
        ]
      }
    ],
  },
]);