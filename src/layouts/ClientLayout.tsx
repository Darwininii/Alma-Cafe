import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../actions";
import { useRoleUser, useUser } from "../hooks";
import { useEffect } from "react";
import { supabase } from "../supabase/client";
import { Loader } from "../Components/shared/Loader";
import { LayoutDashboard, LogOut, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export const ClientLayout = () => {
  const { session, isLoading: isLoadingSession } = useUser();
  const { data: role, isLoading: isLoadingRole } = useRoleUser(
    session?.user.id as string
  );

  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="min-h-screen bg-transparent">
      {/* Navigation Bar */}
      <div className="top-20 z-30 bg-transparent backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Tabs Navigation */}
            <nav className="flex items-center space-x-1">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-stone-100 rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className={`relative z-10 flex items-center gap-2 ${isActive ? "text-stone-900" : "text-stone-500 hover:text-stone-900"}`}>
                        <tab.icon size={18} />
                        {tab.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* Admin Dashboard Link */}
              {role === "admin" && (
                <NavLink
                  to="/dashboard/productos"
                  className="relative px-4 py-2 rounded-full text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </NavLink>
              )}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 py-2 text-black/70 text-sm font-medium hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"
            >
              <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};
