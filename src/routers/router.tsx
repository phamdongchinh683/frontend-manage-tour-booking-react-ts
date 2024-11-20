import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "../components/Layout";
import useToken from "../jwt/useToken";
import { Login } from "../pages/Auth/Login";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import { RoleCreationForm } from "../pages/Role/Components/RoleCreationForm";
import { RoleList } from "../pages/Role/Components/RoleList";
import { TourCreationForm } from "../pages/Tour/Components/TourCreationForm";
import { TourDetailById } from "../pages/Tour/Components/TourDetail";
import { TourList } from "../pages/Tour/Components/TourList";
import { TourUpdateForm } from "../pages/Tour/Components/TourUpdateForm";
import { UserCreationForm } from "../pages/User/Components/UserCreationForm";
import { UserDetailById } from "../pages/User/Components/UserDetail";
import { UserList } from "../pages/User/Components/UserList";
import { UserUpdateForm } from "../pages/User/Components/UserUpdateForm";

export const RouterApp: React.FC = () => {
  const { isAuthenticated } = useToken();

  const router = createBrowserRouter([
    {
      path: "/login",
      element: isAuthenticated() ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <Login />
      ),
      index: true,
    },
    {
      path: "/",
      element: isAuthenticated() ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/dashboard",
      element: isAuthenticated() ? (
        <Layout />
      ) : (
        <Navigate to="/login" replace />
      ),
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
              element: <UserUpdateForm />,
            },
            {
              path: "manage-user/detail-user/:id",
              element: <UserDetailById />,
            },
            {
              path: "manage-tour/tour",
              element: <TourList />,
            },
            {
              path: "manage-tour/create-tour",
              element: <TourCreationForm />,
            },
            {
              path: "manage-tour/detail-tour/:id",
              element: <TourDetailById />,
            },
            {
              path: "manage-tour/edit-tour/:id",
              element: <TourUpdateForm />,
            },
            {
              path: "manage-role/role",
              element: <RoleList />,
            },
            {
              path: "manage-role/create-role",
              element: <RoleCreationForm />,
            },
            {
              path: "*",
              element: <NotFound />,
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
