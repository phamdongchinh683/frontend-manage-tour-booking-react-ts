import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from '../components/Layout';
import useToken from "../jwt/useToken";
import { Login } from "../pages/Auth/Login";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import { UserCreationForm } from "../pages/User/Components/UserCreationForm";
import { UserList } from "../pages/User/Components/UserList";
import { UserUpdateForm } from "../pages/User/Components/UserUpdateForm";
import { UserDetailById } from "../pages/User/Components/UserDetail";

export const RouterApp: React.FC = () => {
  const { isAuthenticated } = useToken();

  const router = createBrowserRouter([
    {
      path: "/login",
      element: isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />,
      index: true,
    },
    {
      path: "/",
      element: isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />,
    },
    {
      path: "/dashboard",
      element: isAuthenticated() ? <Layout /> : <Navigate to="/login" replace />,
      children: [
        {
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: "manage-user/user",
              element: <UserList />,
            },
            {
              path: "manage-user/create-user",
              element: <UserCreationForm />,
            },
            {
              path: "manage-user/edit-user/:id",
              element: <UserUpdateForm/>
            },
            {
              path: "manage-user/detail-user/:id",
              element: <UserDetailById/>
            },
            {
              path: "*",
              element: <p>403 Forbidden Error</p>,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};
