import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout, ClientLayout } from "../layouts";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { lazy, Suspense } from "react";
import { Loader } from "@/Components/shared/Loader";

// Lazy load pages
const HomePage = lazy(() => import("../pages/HomePage").then(module => ({ default: module.HomePage })));
const AboutPage = lazy(() => import("../pages/AboutPage").then(module => ({ default: module.AboutPage })));
const TiendaPage = lazy(() => import("../pages/TiendaPage").then(module => ({ default: module.TiendaPage })));
const ProductsPage = lazy(() => import("../pages/ProductsPage").then(module => ({ default: module.ProductsPage })));
const LoginPage = lazy(() => import("../pages/LoginPage").then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("../pages/RegisterPage").then(module => ({ default: module.RegisterPage })));
const OrdersUserPage = lazy(() => import("../pages/OrdersUserPage").then(module => ({ default: module.OrdersUserPage })));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage").then(module => ({ default: module.CheckoutPage })));
const OrderUserPage = lazy(() => import("../pages/OrderUserPage").then(module => ({ default: module.OrderUserPage })));
const DashProductsPage = lazy(() => import("../pages/dashboard/DashProductsPage").then(module => ({ default: module.DashProductsPage })));
const DashNewProductPage = lazy(() => import("../pages/dashboard/DashNewProductPage").then(module => ({ default: module.DashNewProductPage })));
const DashProductSlugPage = lazy(() => import("../pages/dashboard/DashProductSlugPage").then(module => ({ default: module.DashProductSlugPage })));
const DashOrdersPage = lazy(() => import("../pages/dashboard/DashOrdersPage").then(module => ({ default: module.DashOrdersPage })));
const DashboardOrderPage = lazy(() => import("../pages/dashboard/DashOrderPage").then(module => ({ default: module.DashboardOrderPage })));
const PruebasPage = lazy(() => import("../pages/PruebasPage").then(module => ({ default: module.PruebasPage })));
const BrandsPage = lazy(() => import("../pages/dashboard/BrandsPage").then(module => ({ default: module.BrandsPage })));
const IconTestPage = lazy(() => import("../pages/IconTestPage").then(module => ({ default: module.IconTestPage })));
const ThemeTestPage = lazy(() => import("../pages/ThemeTestPage").then(module => ({ default: module.ThemeTestPage })));

const SuspenseLayout = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader /></div>}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <SuspenseLayout><HomePage /></SuspenseLayout>,
      },
      {
        path: "test-icons",
        element: <SuspenseLayout><IconTestPage /></SuspenseLayout>,
      },
      {
        path: "test-theme",
        element: <SuspenseLayout><ThemeTestPage /></SuspenseLayout>,
      },
      {
        path: "productos",
        element: <SuspenseLayout><TiendaPage /></SuspenseLayout>,
      },
      {
        path: "productos/:slug",
        element: <SuspenseLayout><ProductsPage /></SuspenseLayout>,
      },
      {
        path: "nosotros",
        element: <SuspenseLayout><AboutPage /></SuspenseLayout>,
      },
      {
        path: "pruebas",
        element: <SuspenseLayout><PruebasPage /></SuspenseLayout>,
      },
      {
        path: "login",
        element: <SuspenseLayout><LoginPage /></SuspenseLayout>,
      },
      {
        path: "registro",
        element: <SuspenseLayout><RegisterPage /></SuspenseLayout>,
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
            element: <SuspenseLayout><OrdersUserPage /></SuspenseLayout>,
          },
          {
            path: "pedidos/:id",
            element: <SuspenseLayout><OrderUserPage /></SuspenseLayout>,
          },
        ],
      },
    ],
  },
  {
    path: "/checkout",
    element: <SuspenseLayout><CheckoutPage /></SuspenseLayout>,
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
        element: <SuspenseLayout><DashProductsPage /></SuspenseLayout>,
      },
      {
        path: "productos/new",
        element: <SuspenseLayout><DashNewProductPage /></SuspenseLayout>,
      },
      {
        path: "productos/editar/:slug",
        element: <SuspenseLayout><DashProductSlugPage /></SuspenseLayout>,
      },
      {
        path: "ordenes",
        element: <SuspenseLayout><DashOrdersPage /></SuspenseLayout>,
      },
      {
        path: "ordenes/:id",
        element: <SuspenseLayout><DashboardOrderPage /></SuspenseLayout>,
      },
      {
        path: "marcas",
        element: <SuspenseLayout><BrandsPage /></SuspenseLayout>,
      },
    ],
  },
]);
