import { motion, type Variants } from "framer-motion";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { CustomNews } from "@/Components/shared/CustomNews";
import { CustomCard } from "@/Components/shared/CustomCard";
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
          {/* Contenido animado con fondo blanco */}
          <motion.div variants={contentVariant}>
            <CustomCard
              variant="glass"
              padding="lg"
              rounded="3xl"
              className="bg-white/90 dark:bg-zinc-900/90 border-white/20 dark:border-white/5 h-full"
            >
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              <div className="relative z-10">
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-5xl text-gray-900 dark:text-white">
                  Suscríbete a nuestro <span className="text-primary">Boletín</span>
                </h2>
                <p className="mb-8 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Recibe promociones exclusivas, novedades deliciosas y contenido especial directamente en tu bandeja de entrada.
                </p>

                <CustomNews
                  className="flex flex-col gap-4"
                  label="Correo electrónico"
                  placeholder="ejemplo@correo.com"
                  inputClassName="bg-gray-50 dark:bg-transparent font-bold"
                  buttonSize="lg"
                  buttonText="¡Quiero suscribirme!"
                  buttonClassName="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-xl font-bold text-lg"
                />

                <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      <BsPatchCheckFill size={16} />
                    </div>
                    <span>Sin Spam, solo calidad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <AiFillSafetyCertificate size={18} />
                    </div>
                    <span>Tus datos están seguros</span>
                  </div>
                </div>
              </div>
            </CustomCard>
          </motion.div>

          {/*Imagen animada con fondo degradado personalizado */}
          <motion.div variants={imageVariant}>
            <CustomCard
              variant="glass"
              padding="none"
              rounded="3xl"
              className="relative h-80 lg:h-full overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0" />

              {/* Pattern Overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  {icons.map((Icon, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <CustomCard
                        variant="glass"
                        padding="none"
                        className="h-28 w-28 lg:h-32 lg:w-32 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all duration-300"
                      >
                        <Icon className="dark:text-white text-black drop-shadow-md text-6xl" />
                      </CustomCard>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating particles/circles */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400/30 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-red-500/30 rounded-full blur-3xl animate-pulse delay-700" />
            </CustomCard>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
// ...existing code...
