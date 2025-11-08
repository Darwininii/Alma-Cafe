import React, { useEffect, useState } from "react";
import { FeatureGrid, ProductGrid, Brands } from "../Components/home";
import { popularCelulares, recentCelulares } from "../data/initialData";
import { prepareProducts } from "../helpers";
import { useScrollReveal } from "../Components/shared/Scroll";
import { CardFeature } from "@/Components/shared/CardFeature";

export const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const preparedRecentProducts = prepareProducts(recentCelulares ?? []);
  const preparedPopular = prepareProducts(popularCelulares ?? []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useScrollReveal();
  return (
    <div className="min-h-screen">
      {/* Hero Section con animación de fade in */}
      <section
        className={`
          transition-all duration-1000 ease-out
          ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform -translate-y-10"
          }
        `}
      >
        <CardFeature
          className="bg-transparent border-0 text-3xl font-bold text-center text-gray-800"
          icon="none"
          title="Descubre nuestros Productos, Horarios, Promociones y Más"
        />
      </section>

      {/* Features con animación de scroll */}
      <FeatureGrid />

      {/* Productos con efecto de aparición */}
      <section className="py-16 px-4">
        <div className="container mx-auto space-y-24">
          <div className="scroll-reveal">
            <ProductGrid
              title="Nuestros Productos"
              products={preparedRecentProducts}
            />
          </div>

          <div className="scroll-reveal delay">
            <ProductGrid
              title="Productos Destacados"
              products={preparedPopular}
            />
          </div>
        </div>
      </section>

      <Brands />
    </div>
  );
};

export default HomePage;
