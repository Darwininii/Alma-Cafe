import { motion } from "framer-motion";
import { Coffee, Heart, Users } from "lucide-react";
import { MdOutgoingMail } from "react-icons/md";
import { PiWhatsappLogoBold } from "react-icons/pi";
import { CustomButton } from "../Components/shared/CustomButton";
import { CustomCard } from "../Components/shared/CustomCard";

export const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen rounded-3xl transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="rounded-3xl absolute inset-0 bg-linear-to-b from-stone-500 to-white dark:from-stone-900 dark:to-black opacity-50" />
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-[radial-gradient(#e11d48_1px,transparent_1px)] bg-size-[16px_16px]" />

        <div className="relative container mx-auto px-4 text-center z-10 space-y-6">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full border-2 border-black/20 dark:border-white/10 bg-black/70 dark:bg-white/10 backdrop-blur-sm text-sm font-black tracking-wider text-rose-600 uppercase"
          >
            Nuestra Esencia
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl text-black/80 dark:text-white/80 font-black tracking-tighter"
          >
            Más que Café, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-600">
              Creamos Momentos
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-xl font-bold text-black/80 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            En Alma Café, cada grano cuenta una historia de tradición, pasión y
            excelencia que llevamos directamente a tu mesa.
          </motion.p>
        </div>
      </section>

      {/* Nuestra Historia Section */}
      <section className="py-12 md:py-20 lg:py-32 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div {...fadeIn} className="space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-4xl font-black flex flex-col gap-2">
              <span className="text-rose-600 text-sm md:text-lg font-black uppercase tracking-widest">
                Orígenes
              </span>
              <span className="text-black/80 dark:text-gray-300 font-black">
                Nuestra Historia
              </span>
            </h2>
            <div className="space-y-6 font-bold text-black/80 dark:text-gray-300 leading-relaxed text-lg text-pretty">
              <p>
                Todo comenzó con un sueño simple pero ambicioso: redefinir la
                experiencia del café en nuestra comunidad. Lo que empezó como
                una pequeña barra de café se ha transformado en un santuario
                para los amantes del buen grano.
              </p>
              <p>
                Creemos que el café es un ritual, no una rutina. Por eso,
                recorremos las mejores regiones cafeteras buscando esos granos
                únicos que despiertan los sentidos. Trabajamos de la mano con
                agricultores locales, garantizando no solo calidad suprema, sino
                también un comercio justo y sostenible.
              </p>
              <p>
                Hoy, Alma Café no es solo un lugar para beber café; es un
                espacio donde la cultura, el sabor y la innovación se encuentran
                en cada taza.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <CustomCard
              variant="glass"
              padding="none"
              className="relative h-[500px] w-full rounded-3xl overflow-hidden group shadow-2xl"
            >
              {/* Placeholder Image */}
              <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-neutral-400 dark:text-neutral-600">
                  <Coffee size={48} />
                  <p className="font-bold text-xl uppercase tracking-widest text-center px-4">
                    [ Imagen: Interior de Cafetería o Barista ]
                  </p>
                </div>
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />
            </CustomCard>
          </motion.div>
        </div>
      </section>

      {/* Valores Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <h2 className="text-4xl font-black text-black dark:text-white/80 tracking-tight">
              Nuestros Pilares
            </h2>
            <p className="text-black/80 dark:text-white/80 font-bold text-lg">
              Estos son los valores que guían cada decisión que tomamos y cada
              taza que servimos con una sonrisa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <ValueCard
              icon={<Coffee size={32} />}
              title="Calidad Absoluta"
              description="Seleccionamos rigurosamente cada grano. Si no es excelente, no entra en nuestra casa."
            />
            <ValueCard
              icon={<Users size={32} />}
              title="Comunidad"
              description="Somos un punto de encuentro. Creemos en el poder del café para conectar personas."
            />
            <ValueCard
              icon={<Heart size={32} />}
              title="Pasión"
              description="Amamos lo que hacemos. Esa pasión es el ingrediente secreto en cada preparación."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4 text-center space-y-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          <CustomCard
            variant="solid"
            padding="lg"
            rounded="3xl"
            className="bg-black/90 dark:bg-white/90 text-white dark:text-black shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] dark:bg-[radial-gradient(#000000_2px,transparent_2px)] bg-size-[20px_20px]" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-5xl text-white/80 dark:text-black/80 font-black">
                ¿Listo para vivir la experiencia?
              </h2>
              <p className="text-lg text-white/80 dark:text-black/80 max-w-2xl mx-auto font-bold">
                Visítanos o contáctanos para conocer más sobre nuestros productos
                y servicios de catering.
              </p>

              <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                <CustomButton
                  href="mailto:contacto@almacafe.com"
                  className="px-8 py-4 rounded-2xl border-4 border-black/70 dark:border-black bg-white text-black dark:bg-black/90 dark:text-white dark:hover:text-black font-bold hover:scale-105 transition-transform"
                  size="lg"
                  leftIcon={MdOutgoingMail}
                  effect="shine"
                  effectColor="black"
                  aria-label="Contactar por correo electrónico a contacto@almacafe.com"
                >
                  contacto@almacafe.com
                </CustomButton>
                <CustomButton
                  href="https://wa.me/571234567890"
                  className="px-8 py-4 rounded-2xl border-4 border-green-500 dark:border-green-700 bg-transparent hover:bg-green-500/30 dark:hover:bg-green-700/30 font-bold duration-300 text-white dark:text-black hover:scale-105 transition-transform"
                  size="lg"
                  leftIcon={PiWhatsappLogoBold}
                  effect="shine"
                  effectColor="green"
                  aria-label="Contactar por WhatsApp al +57 123567890"
                >
                  <span className="flex items-center gap-2">
                    +57 123567890
                  </span>
                </CustomButton>
              </div>
            </div>
          </CustomCard>
        </motion.div>
      </section>
    </div>
  );
};

// Helper Component for Value Cards
const ValueCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
  >
    <CustomCard
      variant="glass"
      hoverEffect="none"
      className="h-full border-4 border-black/10 dark:border-white/20 shadow-xl shadow-black/10 dark:shadow-white/10 hover:shadow-black/20 dark:hover:shadow-white/20"
      padding="lg"
      rounded="3xl"
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-200/50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl mb-3 text-black dark:text-white font-black">{title}</h3>
      <p className="text-black/80 dark:text-white/80 leading-relaxed font-bold">
        {description}
      </p>
    </CustomCard>
  </motion.div>
);
