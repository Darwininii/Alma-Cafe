// ...existing code...
import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Store, User, Search } from "lucide-react";
import { GrGroup } from "react-icons/gr";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const navLinks: NavItem[] = [
  { label: "Inicio", icon: Home, href: "/" },
  { label: "Productos", icon: Store, href: "/productos" },
  { label: "Sobre Nosotros", icon: GrGroup, href: "/nosotros" },
];

const socialLinks: NavItem[] = [
  { label: "Buscar", icon: Search, href: "/buscar" },
  { label: "Usuario", icon: User, href: "/" },
];

export const DockNavbar = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <nav
      className="
        fixed top-4 left-1/2 -translate-x-1/2
        bg-white/10 backdrop-blur-md backdrop-saturate-150
        border border-white/20 rounded-3xl shadow-lg
        flex items-center gap-3 px-4 py-2 z-50 transition-all duration-300
      "
    >
      {/* Enlaces principales */}
      {navLinks.map((link, index) => {
        const Icon = link.icon;
        return (
          <div
            key={link.label}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className="relative group"
          >
            <Link
              to={link.href}
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/20 transition-all"
            >
              <Icon
                size={24}
                className={`transition-transform duration-300 ${
                  hovered === index
                    ? "scale-130 text-yellow-800"
                    : "text-slate-800"
                }`}
              />
            </Link>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
              {link.label}
            </span>
          </div>
        );
      })}
      {/* Separador */}
      <div className=" ring ring-slate-800 w-px h-8 bg-slate-800 mx-2"></div>
      {/* Usuario */}
      {socialLinks.map((social, index) => {
        const Icon = social.icon;
        return (
          <div
            key={social.label}
            onMouseEnter={() => setHovered(index + navLinks.length)}
            onMouseLeave={() => setHovered(null)}
            className="relative group"
          >
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/20 transition-all"
            >
              <Icon
                size={22}
                className={`transition-transform duration-300 ${
                  hovered === index + navLinks.length
                    ? "scale-130 text-yellow-800"
                    : "text-slate-800"
                }`}
              />
            </a>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
              {social.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
};
// ...existing code...
