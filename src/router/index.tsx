import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout, ClientLayout } from "../layouts";
import {
  HomePage,
  AboutPage,
  TiendaPage,
  ProductsPage,
  LoginPage,
  RegisterPage,
  OrdersUserPage,
  CheckoutPage,
  GraciasPage,
  OrderUserPage,
  DashProductsPage,
  DashNewProductPage,
} from "../pages";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "productos",
        element: <TiendaPage />,
      },
      {
        path: "products/:slug",
        element: <ProductsPage />,
      },
      {
        path: "nosotros",
        element: <AboutPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "registro",
        element: <RegisterPage />,
      },
      {
        path: "account",
        element: <ClientLayout />,
        children: [
          {
            path: "",
            element: <Navigate to="/account/pedidos" />,
          },
          {
            path: "pedidos",
            element: <OrdersUserPage />,
          },
          {
            path: "pedidos/:id",
            element: <OrderUserPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/checkout/:id/gracias",
    element: <GraciasPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/productos" />,
      },
      {
        path: "productos",
        element: <DashProductsPage />,
      },
      {
        path: "productos/new",
        element: <DashNewProductPage />,
      },
    ],
  },
]);
