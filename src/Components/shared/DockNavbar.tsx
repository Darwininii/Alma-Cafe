import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Store, User, Search } from "lucide-react";
import { GrGroup } from "react-icons/gr";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useGlobalStore } from "@/store/global.store";
import { useCartStore } from "@/store";
import { useUser, useCustomer } from "@/hooks";
import { RiShoppingBag3Line } from "react-icons/ri";
import { FaMoon, FaSun } from "react-icons/fa";
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

  const baseItemClass =
    "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-all";
  const baseIconClass = "transition-transform duration-300";
  const tooltipClass =
    "absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap hidden sm:block";

  const navLinks = [
    { label: "Inicio", icon: Home, href: "/" },
    { label: "Productos", icon: Store, href: "/productos" },
    { label: "Sobre Nosotros", icon: GrGroup, href: "/nosotros" },
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
        className="fixed top-3 left-1/2 -translate-x-1/2 bg-white/20 dark:bg-black/20 backdrop-blur-md backdrop-saturate-150 border border-black/30 dark:border-white/20 rounded-2xl shadow-md shadow-black/10 dark:shadow-white/10 flex items-center justify-center gap-1 sm:gap-3 px-2 py-1.5 sm:px-4 sm:py-2 z-50 w-fit max-w-[95vw] pointer-events-auto"
      >
        {/* 🔹 Enlaces principales */}
        {navLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <div
              key={link.label}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="relative group"
            >
              <Link to={link.href} className={baseItemClass}>
                <Icon
                  size={22}
                  className={`${baseIconClass} ${hovered === index
                    ? "scale-125 text-black dark:text-yellow-400/80"
                    : "text-slate-800 dark:text-white/70"
                    }`}
                />
              </Link>
              <span className={tooltipClass}>{link.label}</span>
            </div>
          );
        })}

        {/* 🔹 Separador
          <div className="hidden sm:block ring ring-slate-800 dark:ring-white w-px h-8 bg-slate-800 dark:bg-white mx-2"></div> */}
        {/* Theme Toggle */}
        <div
          className="relative group"
          onMouseEnter={() => setHovered(12)}
          onMouseLeave={() => setHovered(null)}
        >
          <CustomButton
            onClick={toggleTheme}
            className={`${baseItemClass} relative cursor-pointer border-none bg-transparent hover:bg-black/20 dark:hover:bg-white/20`}
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
                  <FaSun
                    size={22}
                    className={`${baseIconClass} ${hovered === 12
                      ? "scale-125 text-black dark:text-yellow-400/80"
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
                  <FaMoon
                    size={20}
                    className={`${baseIconClass} ${hovered === 12
                      ? "scale-125 text-yellow-600 dark:text-yellow-400/80"
                      : "text-slate-800 dark:text-white/70"
                      }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CustomButton>
          <span className={tooltipClass}>Tema</span>
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
            className={`${baseItemClass} relative cursor-pointer border-none bg-transparent hover:bg-black/20 dark:hover:bg-white/20`}
            size="icon"
            effect="none"
            centerIcon={Search}
          >
            <Search
              size={20}
              className={`${baseIconClass} ${hovered === 10
                ? "scale-125 text-black dark:text-yellow-400/80"
                : "text-slate-800 dark:text-white/70"
                }`}
            />
          </CustomButton>
          <span className={tooltipClass}>Buscar</span>
        </div>

        {/* Carrito */}
        <div
          className="relative group"
          onMouseEnter={() => setHovered(11)}
          onMouseLeave={() => setHovered(null)}
        >
          <CustomButton
            onClick={() => openSheet("cart")}
            className={`${baseItemClass} relative cursor-pointer border-none bg-transparent hover:bg-black/20 dark:hover:bg-white/20`}
            size="icon"
            effect="none"
          >
            <RiShoppingBag3Line
              size={20}
              className={`${baseIconClass} ${hovered === 11
                ? "scale-125 text-black dark:text-yellow-400/80"
                : "text-slate-800 dark:text-white/70"
                }`}
            />

            {/* 🔹 Contador animado */}
            <CustomBadge
              count={totalItemsInCart}
              className="absolute -top-1 -right-1 w-5 h-5 bg-black/80 dark:bg-yellow-600 text-white dark:text-black"
            />
          </CustomButton>
          <span className={tooltipClass}>Carrito</span>
        </div>

        {/* Usuario */}
        <div className="relative group">
          {isLoading ? (
            <div className="flex items-center justify-center w-9 h-9">
              <Loader size={22} className="flex items-center justify-center" />
            </div>
          ) : session ? (
            <Link
              to="/account"
              className="border-3 text-black dark:text-white border-black/70 dark:border-white/70 dark:hover:border-yellow-600/80 dark:hover:text-white/80 w-9 h-9 rounded-2xl grid place-items-center font-black text-black bg-white/20 dark:bg-black/50 hover:bg-black/10 hover:text-white/80 dark:hover:bg-yellow-600/50 transition"
            >
              {customer && customer.full_name
                ? customer.full_name[0].toUpperCase()
                : "U"}
            </Link>
          ) : (
            <Link to="/login" className={baseItemClass}>
              <User
                size={20}
                className={`${baseIconClass} text-slate-800 dark:text-white group-hover:scale-125 group-hover:text-yellow-800 dark:group-hover:text-yellow-400`}
              />
            </Link>
          )}
          <span className={tooltipClass}>Usuario</span>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};
