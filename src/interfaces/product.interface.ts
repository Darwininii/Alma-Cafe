import type { Json } from "@/supabase/supabase";
import type { JSONContent } from "@tiptap/react";

export interface ProductInterface {
  id?: string;
  stock: string;
  price: number;
}
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
  stock: string | null;
}

export interface PreparedProduct extends Product {
  formatPrice?: string;
  id: string;
  name: string;
  brand: string;
  slug: string;
  features: string[];
  description: Json;
  images: string[];
  created_at: string;
  price: number;
  productos: ProductInterface[];
}

export interface ProductInput {
  id?: string;
  name: string;
  brand: string;
  slug: string;
  description: JSONContent;
  images: File[];
  features: string[];
  productos: ProductInterface[];
}

// export interface ProductInterface {
//   id?: string;
//   stock: string;
//   price: number;
// }
// export interface Product {
//   id: string;
//   created_at: string;
//   name: string;
//   brand: string;
//   slug: string;
//   description: Json | string | null;
//   features: string[];
//   images: string[];
//   price: number;
//   stock: string | null;
// }

// export interface PreparedProduct extends Product {
//   formatPrice: string;
// }

// export interface inputForm {
//   id?: string;
//   name: string;
//   brand: string;
//   slug: string;
//   description: JSONContent;
//   images: (File | string)[]; // Puede ser File[] o string[] o una mezcla
//   features: string[];
//   stock: string; // Añadido para el stock del producto principal
//   productos: ProductInterface[];
// }
