import { FlipCard } from "@/Components/shared/FlipCard";
import { useScrollReveal } from "../shared/Scroll";
import { CardFeature } from "../shared/CardFeature";
import { GiCoffeeMug, GiChipsBag, GiPieSlice } from "react-icons/gi";
import { LiaHotdogSolid } from "react-icons/lia";
import { MdEmojiFoodBeverage } from "react-icons/md";
import { RiDrinks2Fill } from "react-icons/ri";

const brands = [
  {
    name: "Café",
    image: "/img/brands/Apple-Logo.webp",
    alt: "Apple Logo",
    icon: (
      <GiCoffeeMug className="text-6xl text-zinc-800 hover:text-zinc-600 transition-colors" />
    ),
  },
  {
    name: "Torta",
    image: "/img/brands/Samsung_Logo.webp",
    alt: "Samsung Logo",
    icon: (
      <GiPieSlice className="text-6xl text-zinc-800 hover:text-zinc-600 transition-colors" />
    ),
  },
  {
    name: "Frappé",
    image: "/img/brands/granizado-intenso-de-limon.webp",
    alt: "Frappé",
    icon: (
      <RiDrinks2Fill className="text-6xl text-zinc-800 hover:text-zinc-600 transition-colors" />
    ),
  },
  {
    name: "Perro Caliente",
    image: "/img/brands/huawei-logo.png",
    alt: "Huawei Logo",
    icon: (
      <LiaHotdogSolid className="text-6xl text-zinc-800 hover:text-zinc-600 transition-colors" />
    ),
  },
  {
    name: "Mecatos",
    image: "/img/brands/realme-logo.webp",
    alt: "Realme Logo",
    icon: (
      <GiChipsBag className="text-6xl text-zinc-800 hover:text-zinc-600 transition-colors" />
    ),
  },
  {
    name: "Té",
    image: "/img/brands/xiaomi-logo.webp",
    alt: "Xiaomi Logo",
    icon: (
      <MdEmojiFoodBeverage className="text-6xl text-zinc-800 hover:text-zinc-600 transition-colors" />
    ),
  },
];

export const Brands = () => {
  useScrollReveal();
  return (
    <div className="scroll-reveal delay">
      <div className="container mx-auto px-4">
        <CardFeature
          className="bg-transparent border-0 mb-16 text-center justify-center"
          title="Nuestras Marcas"
          description="Descubre nuestras marcas de café, seleccionadas cuidadosamente para ofrecerte la mejor calidad y sabor."
          titleClassName="text-4xl font-bold text-black/70 mb-4"
          descriptionClassName="text-lg text-black/70"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center max-w-6xl mx-auto">
          {brands.map((brand, index) => (
            <FlipCard
              key={index}
              containerClassName="shadow-lg hover:shadow-xl"
              frontClassName="bg-transparent backdrop-blur-sm border-none"
              backClassName="bg-transparent border-0 backdrop-blur-sm border-none p-0"
              front={
                <div className="flex flex-col items-center justify-center h-full w-full">
                  {brand.icon}
                  <span className="font-semibold mt-2 text-sm text-zinc-800">
                    {brand.name}
                  </span>
                </div>
              }
              back={
                <img
                  src={brand.image}
                  alt={brand.alt}
                  className="h-full w-full object-cover mx-auto filter contrast-125"
                />
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
