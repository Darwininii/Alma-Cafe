import { Link } from "react-router-dom";
import { CustomSocials } from "./CustomSocials";
import { CustomTitle } from "./CustomTitle";
import { socialLinks } from "../../constants/links";
import { MapPin, Phone, ShieldCheck, Leaf } from "lucide-react";
import { CustomNews } from "./CustomNews";

export const Footer = () => {
  return (
    <footer className="relative bg-black text-slate-300 overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Subtle Noise Texture (Optional, adds premium feel) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Column (Span 4) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <CustomTitle asLink className="text-5xl tracking-tighter" />
              <p className="text-slate-400 leading-relaxed max-w-sm text-base">
                Elevamos la experiencia del café a través de granos seleccionados y un ambiente diseñado para inspirar.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-amber-500/10 transition-colors">
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Visítanos</h4>
                  <p className="text-sm text-slate-500">Calle Principal #123, Ciudad</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-amber-500/10 transition-colors">
                  <Phone className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Llámanos</h4>
                  <p className="text-sm text-slate-500">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer Column (Span 1) */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Links Column (Span 3) */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-lg font-bold text-white uppercase tracking-[0.2em] relative inline-block">
              Explorar
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-amber-600 rounded-full" />
            </h3>

            <nav className="grid grid-cols-1 gap-4">
              {[
                { label: "Inicio", href: "/" },
                { label: "Nuestra Historia", href: "/nosotros" },
                { label: "Menú & Productos", href: "/productos" },
                { label: "Reservaciones", href: "#" },
                { label: "Blog", href: "#" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 w-fit"
                >
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="pt-8">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Legal</h3>
              <nav className="flex flex-col gap-2 text-xs text-slate-600">
                <Link to="#" className="hover:text-amber-500 transition-colors">Política de Privacidad</Link>
                <Link to="#" className="hover:text-amber-500 transition-colors">Términos de Servicio</Link>
              </nav>
            </div>
          </div>

          {/* Newsletter & Socials Column (Span 4) */}
          <div className="lg:col-span-4 space-y-8 bg-white/5 rounded-2xl p-8 border border-white/5 backdrop-blur-sm">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Mantente al día</h3>
              <p className="text-slate-400 text-sm mb-6">Recibe novedades, eventos especiales y descuentos exclusivos.</p>
              <CustomNews
                buttonClassName="w-full justify-center"
                buttonSize="lg"
                inputClassName="bg-transparent border-white/10 text-black placeholder:text-slate-600"
                wrapperClassName="bg-transparent"
              />
            </div>

            <div className="pt-6 border-t border-dashed border-white/10 flex flex-col items-center sm:items-start gap-4">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center sm:text-left w-full">
                Síguenos en redes
              </p>
              {/* 
                    Container for CustomSocials. 
                    Uses proper spacing to ensure the magnetic effect and expansion 
                    has room without layout shift.
                */}
              <div className="relative w-full h-20 flex sm:justify-start justify-center">
                <div className="absolute top-0 sm:left-0">
                  <CustomSocials
                    links={socialLinks}
                    size="md"
                    layout="gooey"
                    effect="magnetic"
                    className="p-0" // Reset padding since we position absolute
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p className="flex items-center gap-1">© {new Date().getFullYear()} <CustomTitle className="text-xs" />. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <div className="flex items-center gap-2" title="Seguridad Garantizada">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>Pago Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
