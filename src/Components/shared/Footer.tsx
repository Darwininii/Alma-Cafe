import { Link } from "react-router-dom";
import { socialLinks } from "../../constants/links";
import { Input } from "@/Components/shared/Input";
import { Button } from "@/Components/shared/Button";

export const Footer = () => {
  return (
    <footer className="relative bg-gray-950/95 backdrop-blur-sm border-t border-white/5 text-slate-200 py-16 px-8 lg:px-12 mt-20">
      {/* Línea superior luminosa */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent"></div>

      <div className="container mx-auto flex flex-wrap justify-between gap-10 text-sm md:flex-nowrap">
        {/* Logo */}
        <div className="flex-1 min-w-[200px]">
          <Link
            to="/"
            className="text-3xl font-bold tracking-tight text-white hover:text-amber-300 transition-colors duration-300"
          >
            Alma Café
          </Link>
          <p className="mt-3 text-xs text-slate-400 max-w-xs leading-relaxed">
            El aroma que te acompaña cada día ☕ — calidad, sabor y tradición.
          </p>
        </div>

        {/* Suscripción */}
        <div className="flex flex-col gap-4 flex-1 min-w-[220px]">
          <p className="font-semibold uppercase tracking-tight">Suscríbete</p>
          <p className="text-xs text-slate-400">
            Recibe las últimas noticias y ofertas exclusivas
          </p>

          <div className="flex flex-col-2 items-center gap-2 border border-white/10 px-3 py-2 backdrop-blur-md">
            <Input
              variant="outline"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
            <Button
              type="submit"
              variant="ghost"
              size="md"
              effect="expandIcon"
              filledIcon
              className="bg-black border-slate-400 font-semibold text-white hover:bg-white/85 hover:text-black hover:ring-amber-500/70 hover:ring-2"
            >
              Suscribete
            </Button>
          </div>
        </div>

        {/* Enlaces legales */}
        <div className="flex flex-col gap-4 flex-1 min-w-[180px]">
          <p className="font-semibold uppercase tracking-tight">Información</p>
          <nav className="flex flex-col gap-2 text-xs font-medium text-slate-400">
            <Link
              to="/productos"
              className="hover:text-amber-300 transition-colors"
            >
              Productos
            </Link>
            <Link to="#" className="hover:text-amber-300 transition-colors">
              Política de privacidad
            </Link>
            <Link to="#" className="hover:text-amber-300 transition-colors">
              Términos de uso
            </Link>
          </nav>
        </div>

        {/* Redes sociales con círculos difusos */}
        <div className="flex flex-col gap-4 flex-1 min-w-[200px]">
          <p className="font-semibold uppercase tracking-tight">Síguenos</p>
          <p className="text-xs leading-6 text-slate-400">
            No te pierdas de las novedades que <strong>Alma Café</strong> tiene
            para ti.
          </p>

          <div className="flex gap-4 flex-wrap">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.title}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-gray-800/50 via-gray-700/30 to-gray-900/10 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.06)] transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(255,215,150,0.5)]"
              >
                <span className="text-slate-100 text-lg">{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Alma Café. Todos los derechos reservados.
      </div>
    </footer>
  );
};
