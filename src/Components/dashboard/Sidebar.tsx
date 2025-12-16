import { NavLink } from "react-router-dom";
import { dashboardLinks } from "../../constants/links";
import { IoLogOutOutline } from "react-icons/io5";
import { signOut } from "../../actions";
import { CustomTitle } from "../shared/CustomTitle";
import { CustomButton } from "../shared/CustomButton";
import { cn } from "../../lib/utils";

export const Sidebar = () => {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="w-[120px] lg:w-[280px] flex flex-col gap-8 items-center p-6 fixed h-screen bg-neutral-900/95 dark:bg-black/80 backdrop-blur-2xl border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-50 transition-all duration-300">

      {/* Logo Section */}
      <div className="w-full flex justify-center py-4 border-b border-white/10">
        <CustomTitle isDashboard asLink />
      </div>

      {/* Navigation */}
      <nav className="w-full space-y-3 flex-1 overflow-y-auto px-2">
        {dashboardLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center justify-center lg:justify-start gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden",
                isActive
                  ? "bg-primary/20 text-primary shadow-[0_0_20px_rgba(234,88,12,0.15)] ring-1 ring-primary/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )
            }
          >
            <span className="relative z-10 text-2xl lg:text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              {link.icon}
            </span>
            <p className="font-semibold hidden lg:block relative z-10 tracking-wide">
              {link.title}
            </p>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </NavLink>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="w-full pt-4 border-t border-white/10">
        <CustomButton
          effect="shine"
          effectColor="rgba(239, 68, 68, 0.5)"
          className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 hover:text-red-400 border border-red-900/30 hover:border-red-500/50 justify-center gap-3 py-6"
          onClick={handleLogout}
        >
          <span className="hidden lg:block">Cerrar sesión</span>
          <IoLogOutOutline size={22} />
        </CustomButton>
      </div>
    </div>
  );
};
