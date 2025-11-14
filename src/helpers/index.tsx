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

// Función para formatear la fecha a formato dd/mm/yyyy
export const formatDate = (date: string): string => {
  const dateObject = new Date(date);
  return dateObject.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  });
};

// Función para obtener el estado del pedido en español
export const getStatus = (status: string): string => {
  switch (status) {
    case "Pending":
      return "Pendiente";
    case "Paid":
      return "Pagado";
    case "Shipped":
      return "Enviado";
    case "Delivered":
      return "Entregado";
    default:
      return status;
  }
};

// Función para generar el slug de un producto
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

//  Funcióna para extraer el PAth relativo al Bucket de una URL
export const extractFilePath = (url: string) => {
  const parts = url.split("/store/v1/object/public/product-images/");

  // Eemplo Parts: ["/store/v1/object/public/product-images/",
  // "0120304050606023052350-Nombre-De-la-Imagen"]
  if (parts.length !== 2) {
    throw new Error(`URL de la imagen no Válida: ${url}`);
  }

  return parts[1];
};
