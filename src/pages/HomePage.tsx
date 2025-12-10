import React, { useEffect, useState } from "react";
import { FeatureGrid, ProductGrid, Brands } from "../Components/home";
import { prepareProducts } from "../helpers";
import { useScrollReveal } from "../Components/shared/Scroll";
import { CardFeature } from "@/Components/shared/CardFeature";
import { useHomeProducts } from "@/hooks";
import { ProductGridSkeleton } from "@/Components/skeletons/ProductGridSkeleton";

export const HomePage: React.FC = () => {
  const { recentProducts, popularProducts, isLoading } = useHomeProducts();

  const [isVisible, setIsVisible] = useState(false);
  const preparedRecentProducts = prepareProducts(recentProducts ?? []);
  const preparedPopular = prepareProducts(popularProducts ?? []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useScrollReveal([isLoading]);
  return (
    <div className="min-h-screen">
      {/* Hero Section con animación de fade in */}
      <section
        className={`
          transition-all duration-1000 ease-out
          ${isVisible
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
