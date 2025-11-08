import { type JSONContent } from "@tiptap/react";

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
  description: JSONContent;
  images: string[];
  created_at: string;
  variants: VariantProduct[];
}

export interface PreparedProduct extends Product {
  price: number;
}
