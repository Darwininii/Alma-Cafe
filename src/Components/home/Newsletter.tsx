import { motion, type Variants } from "framer-motion";
import { Button } from "../shared/Button";
import { ShieldCheck, CircleCheckBig } from "lucide-react";
import { Input } from "@/Components/shared/Input";
import { GiCoffeeMug, GiChipsBag, GiHotDog, GiPieSlice } from "react-icons/gi";
import type { IconType } from "react-icons";

// ...existing code...
export const Newsletter = () => {
  const containerVariant: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.15 },
    },
  };

  const contentVariant: Variants = {
    hidden: { opacity: 0, x: -50 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const imageVariant: Variants = {
    hidden: { opacity: 0, x: 50 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.2,
      },
    },
  };

  const icons: IconType[] = [GiCoffeeMug, GiPieSlice, GiHotDog, GiChipsBag];

  return (
    <motion.section
      className="relative py-16 lg:py-24 overflow-visible"
      variants={containerVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 items-stretch">
          {/* 🧾 Contenido animado con fondo blanco */}
          <motion.div
            variants={contentVariant}
            className="rounded-2xl shadow-xl p-8 lg:p-12 bg-white text-gray-900"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
              Suscríbete a nuestro boletín
            </h2>
            <p className="mb-6 text-gray-600 text-lg">
              Recibe promociones, novedades y contenido exclusivo directamente
              en tu correo.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row">
              <Input
                containerClassName="max-w-sm"
                type="email"
                required
                placeholder="Tu correo electrónico"
                className="flex-1 bg-black/80 ring-1 hover:ring-2 hover:ring-black hover:bg-white hover:text-black p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                type="submit"
                size="md"
                effect="expandIcon"
                filledIcon
                className="bg-black font-semibold text-white hover:bg-white hover:text-black hover:ring-black hover:ring-2"
              >
                Suscribete
              </Button>
            </form>
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CircleCheckBig className="text-green-800/70" />
                <span>Gratis para siempre</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-800/70" />
                <span>Seguro y confiable</span>
              </div>
            </div>
          </motion.div>

          {/* ☕ Imagen animada con fondo degradado personalizado */}
          <motion.div
            variants={imageVariant}
            className="relative h-64 lg:h-full rounded-2xl overflow-hidden bg-linear-to-b to-[#3c1053] from-[#c69c6d] via-[#ab7061]"
          >
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="grid grid-cols-2 gap-4">
                {icons.map((Icon, i) => (
                  <div
                    key={i}
                    className="h-24 w-24 rounded-lg bg-linear-to-b to-[#ab7061] from-[#ab7061] shadow-lg flex items-center justify-center"
                  >
                    <Icon className="text-white/80 text-5xl" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
// ...existing code...
