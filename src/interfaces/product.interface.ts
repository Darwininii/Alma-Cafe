import type { Json } from "@/supabase/supabase";

export interface VariantProduct {
  id: string;
  stock: number;
  price: number;
  storage: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string; // Agregamos brand aquí
  slug: string;
  features: string[];
  description: Json;
  images: string[];
  created_at: string;
  variants: VariantProduct[];
}

export interface PreparedProduct {
  id: string;
  name: string;
  brand: string; // Agregamos brand aquí
  slug: string;
  features: string[];
  description: Json;
  images: string[];
  created_at: string;
  price: number;
  variants: VariantProduct[];
}
