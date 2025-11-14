import type { JSONContent } from "@tiptap/react";

/**
 * Coincide 100% con la tabla `productos` en Supabase
 */
export interface Product {
  id: string;
  created_at: string;
  name: string;
  brand: string;
  slug: string;
  description: JSONContent | string | null;
  features: string[];
  images: string[];
  price: number;
  stock: string | null; // <-- en tu BD ES TEXTO, no number
}

/**
 * Versión para la UI
 */
export interface PreparedProduct extends Product {
  formatPrice?: string;
}

/**
 * Para crear/actualizar productos desde el dashboard
 */
export interface ProductInput {
  name: string;
  brand: string;
  slug: string;
  description: string | JSONContent;
  features: string[];
  price: number;
  stock: string; // <-- debe ser string para que coincida con Supabase
  images: (File | string)[]; // <-- images, NO "image"
}
