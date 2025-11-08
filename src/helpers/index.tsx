import type { Product, PreparedProduct } from "../interfaces";

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const prepareProducts = (products: Product[]): PreparedProduct[] => {
  return products.map((product) => {
    const price = Math.min(...product.variants.map((variant) => variant.price));

    return {
      ...product,
      price,
    };
  });
};
