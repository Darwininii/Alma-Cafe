import { useState } from "react";
import { FlipCard } from "@/Components/shared/FlipCard";
import { useScrollReveal } from "../shared/Scroll";
import { CardFeature } from "../shared/CardFeature";
import { GiChipsBag, GiCoffeeBeans } from "react-icons/gi";
import { SiCocacola, SiDatadog, SiHuawei, SiSamsung } from "react-icons/si";

const categories = [
  {
    name: "Coca-Cola",
    image: "/img/brands/cocacola-log.png",
    alt: "Coca Cola Logo",
    icon: <SiCocacola className="w-12 h-12 md:w-16 md:h-16" />,
    description: "Bebida Refrescante"
  },
  {
    name: "Samsung",
    image: "/img/brands/Samsung_Logo.webp",
    alt: "Samsung Logo",
    icon: <SiSamsung className="w-12 h-12 md:w-16 md:h-16" />,
    description: "Tecnología a tus manos"
  },
  {
    name: "Juan Valdez",
    image: "/img/brands/juanValdez-logo.png",
    alt: "Juan Valdez Logo",
    icon: <GiCoffeeBeans className="w-12 h-12 md:w-16 md:h-16" />,
    description: "Café Colombiano"
  },
  {
    name: "Huawei",
    image: "/img/brands/huawei-logo.png",
    alt: "Huawei Logo",
    icon: <SiHuawei className="w-12 h-12 md:w-16 md:h-16" />,
    description: "Tecnología de Vanguardia"
  },
  {
    name: "Datadog",
    image: "/img/brands/Datadog_logo.svg",
    alt: "Datadog Logo",
    icon: <SiDatadog className="w-12 h-12 md:w-16 md:h-16" />,
    description: "Monitoreo & Observabilidad"
  },
  {
    name: "Papas Margarita",
    image: "/img/brands/PapasMargarita-logo.webp",
    alt: "Papas Margarita Logo",
    icon: <GiChipsBag className="w-12 h-12 md:w-16 md:h-16" />,
    description: "Crujiente & Rico"
  },
];

const BrandCard = ({ item }: { item: typeof categories[0] }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="cursor-pointer w-full h-[220px] md:h-[280px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <FlipCard
        isFlipped={isFlipped}
        className="w-full h-full"
        containerClassName="w-full h-full"
        frontClassName="!bg-transparent dark:!bg-transparent !backdrop-blur-md !border-white/20 dark:!border-white/10 shadow-lg"
        backClassName="border-none shadow-lg !bg-transparent dark:!bg-transparent backdrop-blur-md"
        front={
          <div className="flex flex-col items-center justify-center gap-2 text-center h-full w-full p-4">
            <div className="absolute top-2 justify-center opacity-70 text-[10px] uppercase tracking-widest text-black/80 dark:text-white/80">
              Ver Marca
            </div>
            <div className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center bg-black/10 dark:bg-white/10 rounded-full p-4 mb-2 backdrop-blur-sm border-2 border-black/20 dark:border-white/20 text-black dark:text-neutral-200 transition-colors duration-300">
              {item.icon}
            </div>
            <div className="space-y-0.5">
              <h3 className="text-lg md:text-xl font-bold text-black dark:text-white leading-tight">
                {item.name}
              </h3>
              {/* <p className="text-xs md:text-sm text-black/60 dark:text-neutral-400 font-medium leading-tight">
                {item.description}
              </p> */}
            </div>
          </div>
        }
        back={
          <div className="flex flex-col items-center justify-center gap-2 text-center h-full w-full p-4 relative">
            <div className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center bg-black/10 dark:bg-white/10 rounded-full p-4 mb-4 backdrop-blur-sm border-2 border-black/20 dark:border-white/20">
               <img
                  src={item.image}
                  alt={item.name}
                  width="150"
                  height="150"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-md"
                />
            </div>
            <div className="space-y-0.5 w-full">
              <h3 className="text-lg md:text-xl font-bold text-black dark:text-white leading-tight">
                {item.name}
              </h3>
            </div>
          </div>
        }
      />
    </div>
  );
}

export const Brands = () => {
  useScrollReveal();

  return (
    <div className="py-20 bg-transparent scroll-reveal">
      <div className="container mx-auto px-4">
        <CardFeature
          className="bg-transparent border-0 shadow-none mb-16 text-center max-w-3xl mx-auto p-0"
          title="Nuestras Marcas"
          description="Explora nuestra selección de sabores únicos."
          titleClassName="text-4xl md:text-5xl font-black text-black/90 dark:text-white mb-4 tracking-tight"
          descriptionClassName="text-lg text-black/60 dark:text-white/60 font-medium"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-4 max-w-7xl mx-auto justify-items-center">
          {categories.map((item, index) => (
            <BrandCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
