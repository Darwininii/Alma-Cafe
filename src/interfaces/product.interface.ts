import type { Json } from "@/supabase/supabase";
import type { JSONContent } from "@tiptap/react";

// Tipos de tags para productos
export type ProductTag = "Nuevo" | "Promoción" | null;

// Interfaz que coincide exactamente con la tabla 'productos' de Supabase
export interface Product {
  id: string;
  created_at: string;
  name: string;
  brand: string;
  slug: string;
  description: Json | string | null;
  features: string[];
  images: string[];
  price: number;
  stock: string | null; // "Disponible" | "Agotado"
  tag?: ProductTag; // Nuevo campo para tags
}

// Producto preparado para mostrar en la UI
export interface PreparedProduct extends Product {
  formatPrice?: string;
}

// Input para crear/editar productos
export interface ProductInput {
  id?: string;
  name: string;
  brand: string;
  slug: string;
  description: JSONContent;
  images: File[] | string[]; // Puede ser archivos nuevos o URLs existentes
  features: string[];
  price: number;
  stock: string;
  tag?: ProductTag; // Nuevo campo para tags
}
