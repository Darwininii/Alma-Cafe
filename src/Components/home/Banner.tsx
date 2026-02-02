"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sparkles } from "lucide-react";
import { CustomButton } from "@/Components/shared/CustomButton";
import { CustomTitle } from "@/Components/shared/CustomTitle";
import { GiCoffeeMug, GiChipsBag } from "react-icons/gi";
import { LiaHotdogSolid } from "react-icons/lia";
import { PiShoppingBagOpenFill } from "react-icons/pi";

export const Banner = () => {
  const icons = [GiCoffeeMug, LiaHotdogSolid, GiChipsBag];
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.2 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lógica de animación controlada manualmente
  useEffect(() => {
    let isMounted = true;

    const startAnimation = async () => {
      if (!isMounted) return;

      // Espera 5 segundos antes de la primera animación
      await new Promise((res) => setTimeout(res, 5000));

      if (!isMounted) return;

      // Animación inicial
      await controls.start((i) => ({
        scale: [1, 1.25, 1],
        opacity: [1, 0.8, 1],
        y: [0, -10, 0],
        transition: {
          delay: i * 0.2,
          duration: 0.8,
          ease: "easeInOut",
        },
      }));

      if (!isMounted) return;

      // Repetir cada 8 segundos
      intervalRef.current = setInterval(() => {
        if (!isMounted) return;
        controls.start((i) => ({
          scale: [1, 1.25, 1],
          opacity: [1, 0.8, 1],
          y: [0, -10, 0],
          transition: {
            delay: i * 0.2,
            duration: 0.8,
            ease: "easeInOut",
          },
        }));
      }, 8000);
    };

    if (inView) {
      startAnimation();
    } else {
      controls.stop();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    // Limpieza al desmontar o cambiar el estado de visibilidad
    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [inView, controls]);

  // Animación de entrada general del banner
  const parentVariant = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { delayChildren: 0.2, staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={parentVariant}
      initial="initial"
      animate="animate"
      className="relative text-white overflow-hidden min-h-120 flex items-center justify-center"
    >
      {/* Imagen de fondo */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/img/img-banner.jpg')" }}
      /> */}

      {/* Overlay */}
      <div className="inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/90 dark:from-white/80 dark:via-white/60 dark:to-white/90" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4 text-center lg:py-40 lg:px-8">
        {/* 🧃 Iconos animados */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {icons.map((Icon, i) => (
            <motion.div
              key={i}
              custom={i}
              animate={controls}
              initial={{ scale: 0.8, opacity: 0, y: -15 }}
              className="text-black/80 font-black dark:text-white/80 text-4xl"
            >
              <Icon />
            </motion.div>
          ))}
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold dark:text-white/70 lg:text-6xl mb-2">
          Bienvenido a <CustomTitle className="text-amber-700/80 dark:text-amber-600 text-4xl lg:text-6xl" />
        </h1>

        {/* Descripción */}
        <p className="text-lg lg:text-2xl text-gray-200 dark:text-white/70">
          Disfruta del mejor café de la ciudad
        </p>

        {/* Subtexto con icono */}
        <div className="flex items-center justify-center gap-2 text-sm text-white dark:text-white/70">
          <Sparkles className="w-4 h-4 text-black dark:text-white" />
          Promociones exclusivas para ti
        </div>

        {/* Botón */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <CustomButton
            to="/productos"
            type="button"
            size="md"
            effect="expandIcon"
            filledIcon
            rightIcon={PiShoppingBagOpenFill}
            effectColor="dark:bg-yellow-600/80 bg-amber-600"
            className="group bg-black/80 dark:bg-white/90 text-slate-300 dark:text-black px-6 py-3 font-semibold hover:text-black dark:hover:text-black shadow-black/40 hover:shadow-lg dark:shadow-white/20 dark:hover:shadow-lg  transition-all duration-300 ease-in-out flex items-center gap-2 ring-black dark:ring-white/80 ring-[1.5px] hover:ring-2 rounded-2xl hover:scale-105 active:scale-95"
          >
            Explorar Productos
          </CustomButton>
        </motion.div>
      </div>

      {/* Barra de progreso decorativa */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 h-1 bg-amber-900 dark:bg-yellow-600 shadow-2xl"
      />
    </motion.div>
  );
};
