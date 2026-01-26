import { Outlet, useLocation } from "react-router-dom";
import { DockNavbar } from "../Components/shared/DockNavbar";
import { Footer } from "../Components/shared/Footer";
import { Banner, Newsletter } from "../Components/home";
import { Sheet } from "../Components/shared/Sheet";
import { useGlobalStore } from "@/store/global.store";
import { FloatingCart } from "../Components/shared/FloatingCart";

export const RootLayout = () => {
  const { pathname } = useLocation();
  const isSheetOpen = useGlobalStore((state) => state.isSheetOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <DockNavbar />
      
      {/* Floating Cart Button - Visible everywhere */}
      <FloatingCart />

      {pathname === "/" && <Banner />}

      <main className="container my-20 flex-1">
        <Outlet />
      </main>
      {pathname === "/" && <Newsletter />}

      {isSheetOpen && <Sheet />}

      <Footer />
    </div>
  );
};
