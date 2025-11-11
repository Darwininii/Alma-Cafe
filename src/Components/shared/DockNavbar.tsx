import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Store, User, Search, ShoppingBag } from "lucide-react";
import { GrGroup } from "react-icons/gr";
import { useGlobalStore } from "@/store/global.store";
import { useCartStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";

export const DockNavbar = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const openSheet = useGlobalStore((state) => state.openSheet);
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);

  // 🔹 Detectar dirección del scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scroll hacia abajo → ocultar navbar
        setShowNavbar(false);
      } else {
        // Scroll hacia arriba → mostrar navbar
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseItemClass =
    "flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-full hover:bg-white/20 transition-all";
  const baseIconClass = "transition-transform duration-300";
  const tooltipClass =
    "absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap hidden sm:block";

  const navLinks = [
    { label: "Inicio", icon: Home, href: "/" },
    { label: "Productos", icon: Store, href: "/productos" },
    { label: "Sobre Nosotros", icon: GrGroup, href: "/nosotros" },
  ];

  const actions = [
    { label: "Buscar", icon: Search, action: () => openSheet("search") },
    { label: "Carrito", icon: ShoppingBag, action: () => openSheet("cart") },
    { label: "Usuario", icon: User, href: "/" },
  ];

  return (
    <AnimatePresence>
      {showNavbar && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="
            fixed top-3 left-1/2 -translate-x-1/2
            bg-white/10 backdrop-blur-md backdrop-saturate-150
            border border-white/20 rounded-2xl shadow-lg
            flex items-center justify-center gap-3 sm:gap-4 px-3 py-2 sm:px-4 sm:py-2
            z-50 transition-all duration-300
            w-[90%] sm:w-auto max-w-[360px]
            pointer-events-auto
          "
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
                    className={`${baseIconClass} ${
                      hovered === index
                        ? "scale-125 text-yellow-800"
                        : "text-slate-800"
                    }`}
                  />
                </Link>
                <span className={tooltipClass}>{link.label}</span>
              </div>
            );
          })}

          {/* 🔹 Separador */}
          <div className="hidden sm:block ring ring-slate-800 w-px h-8 bg-slate-800 mx-2"></div>

          {/* 🔹 Acciones */}
          {actions.map((item, index) => {
            const Icon = item.icon;
            const offset = navLinks.length;
            const isCart = item.label === "Carrito";

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHovered(index + offset)}
                onMouseLeave={() => setHovered(null)}
                className="relative group"
              >
                {item.action ? (
                  <button
                    onClick={item.action}
                    className={`${baseItemClass} relative cursor-pointer`}
                  >
                    <Icon
                      size={20}
                      className={`${baseIconClass} ${
                        hovered === index + offset
                          ? "scale-125 text-yellow-800"
                          : "text-slate-800"
                      }`}
                    />

                    {/* 🔹 Contador animado del carrito */}
                    {isCart && totalItemsInCart > 0 && (
                      <AnimatePresence>
                        <motion.span
                          key={totalItemsInCart}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 0.5, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                          }}
                          className="
                            absolute -top-1 -right-1
                            bg-yellow-800 text-white text-[10px] font-bold
                            rounded-full w-4 h-4 flex items-center justify-center
                            shadow-md
                          "
                        >
                          {totalItemsInCart}
                        </motion.span>
                      </AnimatePresence>
                    )}
                  </button>
                ) : (
                  <Link to={item.href || "/"} className={baseItemClass}>
                    <Icon
                      size={20}
                      className={`${baseIconClass} ${
                        hovered === index + offset
                          ? "scale-125 text-yellow-800"
                          : "text-slate-800"
                      }`}
                    />
                  </Link>
                )}
                <span className={tooltipClass}>{item.label}</span>
              </div>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
