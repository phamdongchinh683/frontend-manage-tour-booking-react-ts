import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "../components/Layout";
import useToken from "../jwt/useToken";
import { Login } from "../pages/Auth/Login";

import { BookTourCreationForm } from "../pages/Booking/Components/BookTourCreationForm";
import { BookTourDetailById } from "../pages/Booking/Components/BookTourDetail";
import { BookTourList } from "../pages/Booking/Components/BookTourList";
import { BookTourUpdateForm } from "../pages/Booking/Components/BookTourUpdateForm";
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
import { PaymentCreationForm } from "../pages/Payment/Components/PaymentCreationForm";
import { PaymentList } from "../pages/Payment/Components/PaymentList";
import { PaymentDetailById } from "../pages/Payment/Components/PaymentDetail";
import { PaymentUpdateForm } from "../pages/Payment/Components/PaymentUpdateForm";

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
            //user
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
            // tour
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
            // book tour
            {
              path: "manage-book-tour/book-tour-list",
              element: <BookTourList />,
            },
            {
              path: "manage-book-tour/create-book-tour",
              element: <BookTourCreationForm />,
            },
            {
              path: "manage-book-tour/detail-book-tour/:id",
              element: <BookTourDetailById />,
            },
            {
              path: "manage-book-tour/edit-book-tour/:id",
              element: <BookTourUpdateForm />,
            },
            // payment
            {
              path: "manage-payment/payment-list",
              element: <PaymentList />,
            },
            {
              path: "manage-payment/create-payment",
              element: <PaymentCreationForm />,
            },
            {
              path: "manage-payment/detail-payment/:id",
              element: <PaymentDetailById />,
            },
            {
              path: "manage-payment/edit-payment/:id",
              element: <PaymentUpdateForm />,
            },
            // role
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
