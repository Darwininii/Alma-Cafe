import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../Components/dashboard";
import { CustomClose } from "../Components/shared/CustomClose";
import { useUser } from "../hooks";
import { useEffect, useState } from "react";
import { getSession, getUserRole } from "../actions";
import { Loader } from "../Components/shared/Loader";
import { supabase } from "../supabase/client";

export const DashboardLayout = () => {
  const navigate = useNavigate();

  const { isLoading, session } = useUser();
  const [roleLoading, setRoleLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      setRoleLoading(true);
      const session = await getSession();
      if (!session) {
        navigate("/login");
      }

      const role = await getUserRole(session.session?.user.id as string);

      if (role !== "admin" && role !== "superAdmin" && role !== "visitor") {
        navigate("/", { replace: true });
      }

      setRoleLoading(false);
    };

    checkRole();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login", { replace: true });
      }
    });
  }, [navigate]);

  if (isLoading || !session || roleLoading) return <Loader />;

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen font-montserrat relative">
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Toggle Button */}
      <div className={`fixed top-6 z-40 transition-all duration-500 ${isSidebarOpen ? "left-[120px] lg:left-[255px]" : "left-4"}`}>
         <CustomClose 
            isOpen={!isSidebarOpen} // When sidebar is closed, button state "open" (shows X? No wait, users usually expect hamburger or arrow)
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="w-10 h-10 bg-black/80 dark:bg-white/80 hover:bg-black dark:hover:bg-white/60 dark:text-black text-white border border-white/10 shadow-lg backdrop-blur-md"
            iconSize={20}
         />
      </div>

      <main className={`container m-5 mt-7 flex-1 text-slate-800 transition-all duration-500 ${
        isSidebarOpen ? "ml-[140px] lg:ml-[270px]" : "ml-0 lg:mx-auto max-w-7xl"
      }`}>
        <Outlet />
      </main>
    </div>
  );
};
