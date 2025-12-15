import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../actions";
import { useRoleUser, useUser } from "../hooks";
import { useEffect } from "react";
import { supabase } from "../supabase/client";
import { Loader } from "../Components/shared/Loader";
import { LayoutDashboard, LogOut, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { CustomButton } from "../Components/shared/CustomButton";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";

// Helper simple para validar UUID
const isUUID = (str: string) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(str);
};

export const ClientLayout = () => {
  const { session, isLoading: isLoadingSession } = useUser();
  const { data: role, isLoading: isLoadingRole } = useRoleUser(
    session?.user.id as string
  );

  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  // SANITISER: Eliminar items con IDs inválidos (probablemente antiguos slugs persistidos)
  useEffect(() => {
    let cleaned = false;
    cartItems.forEach((item) => {
      // Si el ID NO es un UUID válido (ej: "probando-9" o "prueba")
      if (!isUUID(item.productId)) {
        console.warn(`[ClientLayout] Removing invalid item from cart: ${item.productId}`);
        removeItem(item.productId);
        cleaned = true;
      }
    });

    if (cleaned) {
      toast.error("Hemos eliminado productos con datos inválidos de tu carrito. Por favor agrégalos nuevamente.", {
        duration: 5000,
        position: "bottom-center"
      });
    }
  }, [cartItems, removeItem]);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login", { replace: true });
      }
    });
  }, [navigate]);

  if (isLoadingSession || isLoadingRole) return <Loader />;

  const handleLogout = async () => {
    await signOut();
  };

  const tabs = [
    { id: "pedidos", label: "Mis Pedidos", path: "/account/pedidos", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Navigation Bar */}
      <div className="top-20 z-30 bg-transparent backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Tabs Navigation */}
            <nav className="flex items-center space-x-2">
              {tabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <CustomButton
                    key={tab.id}
                    to={tab.path}
                    size="sm"
                    leftIcon={tab.icon}
                    effect="none"
                    className={`rounded-full transition-all [&>svg]:mr-0 sm:[&>svg]:mr-2 ${isActive
                      ? "bg-stone-100 text-stone-900 dark:bg-pink-800 dark:text-white font-bold"
                      : "bg-black/15 text-black/80 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white dark:bg-white/10 hover:bg-stone-50/50 dark:hover:bg-pink-800/50"
                      }`}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                  </CustomButton>
                );
              })}

              {/* Admin Dashboard Link */}
              {role === "admin" && (
                <CustomButton
                  to="/dashboard/productos"
                  size="sm"
                  leftIcon={LayoutDashboard}
                  effect="shine"
                  effectColor="white"
                  className="rounded-full bg-pink-700 text-white dark:text-white hover:text-stone-900 dark:hover:text-white hover:bg-stone-50/50 dark:hover:bg-zinc-800/50 transition-all font-medium [&>svg]:mr-0 sm:[&>svg]:mr-2"
                >
                  <span className="hidden sm:inline">Dashboard</span>
                </CustomButton>
              )}
            </nav>

            {/* Logout Button */}
            <CustomButton
              onClick={handleLogout}
              size="sm"
              leftIcon={LogOut}
              effect="none"
              className="dark:hover:font-black font-medium rounded-full bg-red-600 dark:bg-red-700 text-white dark:text-white hover:text-red-600 dark:hover:text-red-500/80 hover:bg-red-50 dark:hover:bg-zinc-800 transition-all [&>svg]:mr-0 sm:[&>svg]:mr-2"
            >
              <span className="hidden sm:inline">Cerrar sesión</span>
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};
