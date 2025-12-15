import { Link } from "react-router-dom";
import { CustomSocials } from "./CustomSocials";
import { socialLinks } from "../../constants/links";
import { MapPin, Phone, Clock, Coffee } from "lucide-react";
import { CustomNews } from "./CustomNews";

export const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-black text-slate-200 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 py-16 relative z-10">
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent hover:from-amber-300 hover:to-amber-500 transition-all duration-300"
            >
              Alma Café
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-500 flex-shrink-0" />
              El aroma que te acompaña cada día — calidad, sabor y tradición en cada taza.
            </p>

            {/* Contact info */}
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Calle Principal #123, Ciudad</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Lun - Vie: 7:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Enlaces Rápidos
            </h3>
            <nav className="flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Productos
              </Link>
              <Link
                to="/nosotros"
                className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Nosotros
              </Link>
              <Link
                to="/tienda"
                className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Tienda
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Legal
            </h3>
            <nav className="flex flex-col gap-3 text-sm">
              <Link
                to="#"
                className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Política de Privacidad
              </Link>
              <Link
                to="#"
                className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Términos de Uso
              </Link>
              <Link
                to="#"
                className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Política de Cookies
              </Link>
              <Link
                to="#"
                className="text-slate-400 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Devoluciones
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Newsletter
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Suscríbete para recibir ofertas exclusivas y novedades.
            </p>

            <CustomNews buttonClassName="text-black" />

            {/* Social Links */}
            <div className="pt-4">
              <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wide">
                Síguenos
              </p>
              <CustomSocials links={socialLinks} size="md" />
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} <span className="text-amber-500 font-semibold">Alma Café</span>. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
