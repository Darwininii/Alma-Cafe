import type { Product, PreparedProduct } from "../interfaces";

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

export const prepareProducts = (products: Product[]): PreparedProduct[] => {
  return products.map((product) => {
    // El precio y stock ya están correctos en el objeto product.
    // Aquí puede hacer cualquier formateo adicional si lo requiere.
    return {
      ...product,
      // Eliminamos la lógica de Math.min sobre variants
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

// Función para obtener el color del estado
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "completed":
    case "paid":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
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
  // Extraer el path después del nombre del bucket (product-images)
  const match = url.match(/\/product-images\/(.+)$/);

  if (!match) {
    throw new Error(`URL de la imagen no Válida: ${url}`);
  }

  return match[1];
};

// Función para sanitizar nombres de archivo
export const sanitizeFileName = (fileName: string): string => {
  const parts = fileName.split('.');
  const extension = parts.pop(); // Obtener extensión
  const name = parts.join('.'); // Resto del nombre

  const sanitized = name
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Reemplazar caracteres especiales
    .replace(/-+/g, '-') // Reemplazar múltiples guiones
    .replace(/^-|-$/g, '') // Remover guiones al inicio/final
    .toLowerCase();

  return `${sanitized}.${extension}`;
};

/**
 * Generates an optimized URL for Supabase Storage images.
 * appends ?width=w&format=webp to the URL.
 * @param url Original image URL
 * @param width Target width (default 500)
 */
export const getOptimizedImageUrl = (url: string, width: number = 500): string => {
  if (!url) return "";
  if (!url.includes("supabase.co")) return url; // Only optimize Supabase images
  // If already has params, append
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}width=${width}&format=webp&resize=contain`;
};
