import { useState } from "react";
import { Icons } from "./Icons";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useGlobalStore } from "@/store/global.store";
import { useCartStore } from "@/store";
import { useUser, useCustomer } from "@/hooks";
import { useThemeStore } from "@/store/theme.store";
import { Loader } from "./Loader";
import { CustomBadge } from "./CustomBadge";
import { CustomButton } from "./CustomButton";

export const DockNavbar = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [showNavbar, setShowNavbar] = useState(true);

  const { scrollY } = useScroll();
  const openSheet = useGlobalStore((state) => state.openSheet);
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);
  const { theme, toggleTheme } = useThemeStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;

    if (latest < 100 || latest < previous) {
      setShowNavbar(true);
    } else if (latest > previous && latest > 100) {
      setShowNavbar(false);
    }
  });

  // const baseItemClass =
  //   "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-all";
  
  // New class for Text-Below items
  const navItemClass = 
    "flex flex-col items-center justify-center px-2 sm:px-3 py-1.5 rounded-xl hover:bg-black/20 dark:hover:bg-white/20 transition-all gap-0.5 group";
    
  const baseIconClass = "transition-transform duration-300";
  // const tooltipClass =
  //   "absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold bg-black/90 dark:bg-white/90 text-white dark:text-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-lg";

  const navLinks = [
    { label: "Inicio", icon: Icons.Home, href: "/" },
    { label: "Productos", icon: Icons.Store, href: "/productos" },
    { label: "Nosotros", icon: Icons.About, href: "/nosotros" },
  ];

  const { session, isLoading } = useUser();
  const userId = session?.user?.id;
  const { data: customer } = useCustomer(userId!);

  return (
    <AnimatePresence>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        initial="hidden"
        animate={showNavbar ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-3 left-1/2 -translate-x-1/2 bg-white/20 dark:bg-black/20 backdrop-blur-md backdrop-saturate-150 border border-black/30 dark:border-white/20 rounded-2xl shadow-md shadow-black/10 dark:shadow-white/10 flex items-center justify-center gap-0.5 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 z-50 w-fit max-w-[95vw] pointer-events-auto"
      >
        {/* 🔹 Enlaces principales (Texto debajo) */}
        {navLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <div
              key={link.label}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="relative"
            >
              <CustomButton
                to={link.href}
                className={`${navItemClass} border-none bg-transparent h-auto w-auto`}
                size="icon"
                effect="none"
              >
                <Icon
                  size={20}
                  className={`${baseIconClass} ${hovered === index
                    ? "scale-110 text-black dark:text-yellow-400"
                    : "text-slate-800 dark:text-white/70"
                    }`}
                />
                <span className="text-[10px] font-bold leading-none tracking-tight text-slate-800 dark:text-white/90">{link.label}</span>
              </CustomButton>
            </div>
          );
        })}

        {/* Theme Toggle */}
        <div
          className="relative group"
          onMouseEnter={() => setHovered(12)}
          onMouseLeave={() => setHovered(null)}
        >
          <CustomButton
            onClick={toggleTheme}
            className={`${navItemClass} border-none bg-transparent h-auto w-auto`}
            size="icon"
            effect="none"
          >
            <AnimatePresence mode="wait">
              {theme === "light" ? (
                <motion.div
                  key="sun"
                  initial={{ scale: 1, rotate: -120 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 120 }}
                  transition={{ duration: 0.7 }}
                >
                  <Icons.Sun
                    size={20}
                    className={`${baseIconClass} ${hovered === 12
                      ? "scale-110 text-black dark:text-yellow-400/80"
                      : "text-slate-800 dark:text-white/70"
                      }`}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ scale: 1, rotate: -120 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 120 }}
                  transition={{ duration: 0.7 }}
                >
                  <Icons.Moon
                    size={18}
                    className={`${baseIconClass} ${hovered === 12
                      ? "scale-110 text-yellow-600 dark:text-yellow-400/80"
                      : "text-slate-800 dark:text-white/70"
                      }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-[10px] font-bold leading-none tracking-tight text-slate-800 dark:text-white/90">Tema</span>
          </CustomButton>
        </div>

        {/* 🔹 Acciones */}

        {/* Buscar */}
        <div
          className="relative group"
          onMouseEnter={() => setHovered(10)}
          onMouseLeave={() => setHovered(null)}
        >
          <CustomButton
            onClick={() => openSheet("search")}
            className={`${navItemClass} border-none bg-transparent h-auto w-auto`}
            size="icon"
            effect="none"
            centerIcon={Icons.Search}
          >
             <Icons.Search
              size={18}
              className={`${baseIconClass} ${hovered === 10
                ? "scale-110 text-black dark:text-yellow-400/80"
                : "text-slate-800 dark:text-white/70"
                }`}
            />
            <span className="text-[10px] font-bold leading-none tracking-tight text-slate-800 dark:text-white/90">Buscar</span>
          </CustomButton>
        </div>

        {/* Carrito */}
        <div
          className="relative group"
          onMouseEnter={() => setHovered(11)}
          onMouseLeave={() => setHovered(null)}
        >
          <CustomButton
            onClick={() => openSheet("cart")}
            className={`${navItemClass} border-none bg-transparent h-auto w-auto`}
            size="icon"
            effect="none"
          >
            {totalItemsInCart > 0 ? (
               <Icons.CartFilled
                 size={18}
                 className={`${baseIconClass} ${hovered === 11
                   ? "scale-110 text-black dark:text-yellow-400/80"
                   : "text-slate-800 dark:text-white/70"
                   }`}
               />
            ) : (
               <Icons.Cart
                 size={18}
                 className={`${baseIconClass} ${hovered === 11
                   ? "scale-110 text-black dark:text-yellow-400/80"
                   : "text-slate-800 dark:text-white/70"
                   }`}
               />
            )}
            <span className="text-[10px] font-bold leading-none tracking-tight text-slate-800 dark:text-white/90">Carrito</span>
            {/* 🔹 Contador animado */}
            <CustomBadge
              count={totalItemsInCart}
              className="absolute -top-1 right-2 w-4 h-4 bg-rose-600 text-white border-2 border-white dark:border-black text-[9px] font-bold dark:font-bold shadow-sm flex items-center justify-center p-0"
            />
          </CustomButton>
        </div>

        {/* Usuario */}
        <div className="relative group">
          {isLoading ? (
            <div className="flex items-center justify-center w-9 h-9">
              <Loader size={18} className="flex items-center justify-center" />
            </div>
          ) : session ? (
             <CustomButton
              to="/account"
              className={`${navItemClass} border-none bg-transparent h-auto w-auto`}
              size="icon"
              effect="none"
            >
              <div className="w-6 h-6 rounded-full border-2 border-slate-800 dark:border-white flex items-center justify-center bg-transparent">
                 <span className="text-[10px] font-bold text-slate-800 dark:text-white">
                  {customer && customer.full_name ? customer.full_name[0].toUpperCase() : "U"}
                 </span>
              </div>
              <span className="text-[10px] font-bold leading-none tracking-tight text-slate-800 dark:text-white/90">Perfil</span>
            </CustomButton>
          ) : (
            <CustomButton to="/login" className={`${navItemClass} border-none bg-transparent h-auto w-auto`} size="icon" effect="none">
              <Icons.User
                size={18}
                className={`${baseIconClass} text-slate-800 dark:text-white/70 group-hover:scale-110 group-hover:text-black dark:group-hover:text-yellow-400`}
              />
              <span className="text-[10px] font-bold leading-none tracking-tight text-slate-800 dark:text-white/90">Login</span>
            </CustomButton>
          )}
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};
