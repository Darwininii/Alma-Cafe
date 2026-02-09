import { NavLink } from "react-router-dom";
import { dashboardLinks } from "../../constants/links";
// import { IoLogOutOutline } from "react-icons/io5";
import { signOut } from "../../actions";
import { CustomTitle } from "../shared/CustomTitle";
import { CustomButton } from "../shared/CustomButton";
import { cn } from "../../lib/utils";
import { useThemeStore } from "@/store/theme.store";
import { FaMoon, FaSun } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className={`w-[110px] lg:w-[250px] flex flex-col gap-6 items-center py-6 fixed h-screen bg-linear-to-b from-neutral-900/98 via-neutral-900/95 to-black/90 dark:from-black/95 dark:via-black/90 dark:to-neutral-950/95 backdrop-blur-3xl border-r border-white/10 shadow-[4px_0_32px_rgba(0,0,0,0.3)] z-50 transition-all duration-500 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}>

      {/* Logo Section */}
      <div className="w-full px-12 flex justify-center py-4 border-b border-white/10 relative group cursor-pointer">
        <CustomTitle isDashboard asLink />
        {/* Logo glow effect */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="w-full space-y-2 flex-1 overflow-y-auto px-8 py-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {dashboardLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden",
                isActive
                  ? "bg-linear-to-r from-primary/30 via-primary/20 to-primary/10 text-primary shadow-[0_0_30px_rgba(234,88,12,0.25),inset_0_0_20px_rgba(234,88,12,0.1)] ring-2 ring-primary/40 scale-105"
                  : "text-neutral-400 hover:text-white hover:bg-white/5 hover:scale-102 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              )
            }
          >
            <span className="relative z-10 text-2xl lg:text-xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 group-hover:drop-shadow-[0_0_8px_rgba(234,88,12,0.6)]">
              {link.icon}
            </span>
            <p className="font-bold hidden lg:block relative z-10 tracking-wide text-sm uppercase">
              {link.title}
            </p>

            {/* Active state shimmer effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Glow on hover */}
            <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle Section */}
      <div className="w-full px-12 pt-3 border-t border-white/10">
        <CustomButton
          onClick={toggleTheme}
          effect="bounce"
          iconSize={22}
          leftIcon={isDark ? FaMoon : FaSun}
          iconClass={cn(
            "transition-all duration-500 group-hover:scale-125 group-hover:rotate-180",
            isDark
              ? "text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]"
              : "text-amber-500 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
          )}
          className={cn(
            "w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden cursor-pointer",
            "bg-transparent! bg-linear-to-br from-white/5 to-white/10 dark:from-white/10 dark:to-white/5",
            "hover:bg-transparent! hover:from-amber-500/20 hover:to-amber-600/10 dark:hover:from-blue-500/20 dark:hover:to-indigo-600/10",
            "border border-white/10 hover:border-amber-500/30 dark:hover:border-blue-500/30",
            "hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          )}
        >
          <p className={cn(
            "font-bold hidden lg:block relative z-10 tracking-wide text-sm uppercase transition-colors duration-300",
            isDark ? "text-blue-300" : "text-amber-400"
          )}>
            {isDark ? "Dark" : "Light"}
          </p>

          {/* Background glow effect */}
          <div className={cn(
            "absolute inset-0 opacity-50 blur-2xl transition-all duration-500 pointer-events-none",
            isDark
              ? "bg-blue-500/30"
              : "bg-amber-500/30"
          )} />

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </CustomButton>
      </div>

      {/* Logout Section */}
      <div className="w-full px-12 pt-3 border-t border-white/10">
        <CustomButton
          effect="shine"
          effectColor="rgba(239, 68, 68, 0.6)"
          iconClass="group-hover:rotate-12 transition-transform duration-300"
          className="w-full bg-linear-to-br from-red-600/15 to-red-700/10 hover:from-red-600/25 hover:to-red-700/20 text-red-400 hover:text-red-300 border-2 border-red-900/40 hover:border-red-500/60 justify-center gap-3 py-5 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_35px_rgba(239,68,68,0.4)] hover:scale-105 transition-all duration-500"
          onClick={handleLogout}
        >
          <span className="hidden lg:block font-bold tracking-wide text-sm uppercase">Cerrar sesión</span>
        </CustomButton>
      </div>
    </div>
  );
};
