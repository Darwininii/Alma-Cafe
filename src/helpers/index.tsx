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

// TODO: Codigo Original...

// import { Color, Product, VariantProduct } from "../interfaces";

// // Función para formatear el precio a dólares
// export const formatPrice = (price: number) => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(price);
// };

// // Función para preparar los productos - (CELULARES)
// export const prepareProducts = (products: Product[]) => {
//   return products.map((product) => {
//     // Agrupar las variantes por color
//     const colors = product.variants.reduce(
//       (acc: Color[], variant: VariantProduct) => {
//         const existingColor = acc.find((item) => item.color === variant.color);

//         if (existingColor) {
//           // Si ya existe el color, comparamos los precios
//           existingColor.price = Math.min(existingColor.price, variant.price);
//         } // Mantenemos el precio mínimo
//         else {
//           acc.push({
//             color: variant.color,
//             price: variant.price,
//             name: variant.color_name,
//           });
//         }

//         return acc;
//       },
//       []
//     );

//     // Obtener el precio más bajo de las variantes agrupadas
//     const price = Math.min(...colors.map((item) => item.price));

//     // Devolver el producto formateado
//     return {
//       ...product,
//       price,
//       colors: colors.map(({ name, color }) => ({ name, color })),
//       variants: product.variants,
//     };
//   });
// };

// // Función para formatear la fecha a formato 3 de enero de 2022
// export const formatDateLong = (date: string): string => {
//   const dateObject = new Date(date);

//   return dateObject.toLocaleDateString("es-ES", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// };

// // Función para formatear la fecha a formato dd/mm/yyyy
// export const formatDate = (date: string): string => {
//   const dateObject = new Date(date);
//   return dateObject.toLocaleDateString("es-ES", {
//     year: "numeric",
//     month: "2-digit",
//     day: "numeric",
//   });
// };

// // Función para obtener el estado del pedido en español
// export const getStatus = (status: string): string => {
//   switch (status) {
//     case "Pending":
//       return "Pendiente";
//     case "Paid":
//       return "Pagado";
//     case "Shipped":
//       return "Enviado";
//     case "Delivered":
//       return "Entregado";
//     default:
//       return status;
//   }
// };

// // Función para generar el slug de un producto
// export const generateSlug = (name: string): string => {
//   return name
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "");
// };

// // Función para extraer el path relativo al bucket de una URL
// export const extractFilePath = (url: string) => {
//   const parts = url.split("/storage/v1/object/public/product-images/");
//   // EJEMPLO PARTS: ['/storage/v1/ object/public/product-images/', '02930920302302030293023-iphone-12-pro-max.jpg']

//   if (parts.length !== 2) {
//     throw new Error(`URL de imagen no válida: ${url}`);
//   }

//   return parts[1];
// };
