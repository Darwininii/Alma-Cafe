// import React, { useEffect, useState } from "react";
import { FeatureGrid, ProductGrid, Brands } from "../Components/home";
import { prepareProducts } from "../helpers";
import { useScrollReveal } from "../Components/shared/Scroll";
import { CardFeature } from "@/Components/shared/CardFeature";
import { useHomeProducts } from "@/hooks";
import { ProductGridSkeleton } from "@/Components/skeletons/ProductGridSkeleton";

export const HomePage: React.FC = () => {
  const { recentProducts, popularProducts, isLoading } = useHomeProducts();

  const preparedRecentProducts = prepareProducts(recentProducts ?? []);
  const preparedPopular = prepareProducts(popularProducts ?? []);

  useScrollReveal([isLoading]);
  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Hero Section con animación de fade in */}
      <section
          className={`
          transition-all duration-1000 ease-out
          opacity-100 transform translate-y-0
        `}
      >
        <CardFeature
          as="h1"
          className="text-3xl font-bold text-center text-gray-800 dark:text-white"
          icon="none"
          title="Descubre nuestros Productos, Horarios, Promociones y Más"
        />
      </section>

      {/* Features con animación de scroll */}
      <FeatureGrid />
      {isLoading ? (
        <ProductGridSkeleton numberOfProducts={4} />
      ) : (
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
      )}

      <Brands />
    </div>
  );
};

export default HomePage;
