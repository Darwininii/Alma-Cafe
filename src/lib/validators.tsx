import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

export const userRegisterSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  fullName: z.string().min(1, "El nombre completo es requerido"),
  phone: z.string().optional(),
});

export const addressSchema = z.object({
  addressLine: z
    .string()
    .min(1, "La dirección es requerida")
    .max(100, "La dirección no debe exceder los 100 carácteres"),
  city: z
    .string()
    .min(1, "La ciudad es requerida")
    .max(50, "La ciudad no debe exceder los 50 carácteres"),
  state: z
    .string()
    .min(1, "El Barrio es requerido")
    .max(50, "El Barrio no debe exceder los 50 carácteres"),
  postalCode: z
    .string()
    .max(10, "El código postal no debe exceder los 10 carácteres")
    .optional(),
  country: z.string().min(1, "El país es requerido"),
});

export type UserRegisterFormValues = z.infer<typeof userRegisterSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;

const isContentEmpty = (value: JSONContent): boolean => {
  if (!value || !Array.isArray(value.content) || value.content.length == 0) {
    return true;
  }

  return !value.content.some(
    (node) =>
      node.type === "paragraph" &&
      node.content &&
      Array.isArray(node.content) &&
      node.content.some(
        (textNode) =>
          textNode.type === "text" &&
          textNode.text &&
          textNode.text.trim() !== ""
      )
  );
};

// Schema actualizado para coincidir con la estructura de la base de datos
export const productSchema = z.object({
  name: z.string().min(1, "El nombre del producto es obligatorio"),
  brand: z.string().min(1, "La marca del producto es obligatoria"),
  slug: z
    .string()
    .min(1, "El slug del producto es obligatorio")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  features: z.array(
    z.object({
      value: z.string().min(1, "La característica no puede estar vacía"),
    })
  ),
  description: z.custom<JSONContent>(
    (value): value is JSONContent => !isContentEmpty(value as JSONContent),
    {
      message: "La descripción no puede estar vacía",
    }
  ),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
  stock: z.string().min(1, "El stock es obligatorio"),
  tag: z.string().optional(),
  images: z.array(z.any()).min(1, "Debe haber al menos una imagen"),
  products: z
    .array(
      z.object({
        stock: z.union([z.number(), z.string()]),
        price: z.number(),
      })
    )
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(13, "Número de tarjeta inválido")
    .max(19, "Número de tarjeta inválido")
    .regex(/^\d+$/, "Solo se permiten números"),
  cardHolder: z.string().min(1, "El nombre del titular es requerido"),
  expMonth: z
    .string()
    .min(2, "Mes inválido (MM)")
    .max(2, "Mes inválido (MM)")
    .regex(/^(0[1-9]|1[0-2])$/, "Mes inválido (01-12)"),
  expYear: z
    .string()
    .min(2, "Año inválido (YY)")
    .max(2, "Año inválido (YY)")
    .regex(/^\d+$/, "Solo se permiten números"),
  cvc: z
    .string()
    .min(3, "CVC inválido")
    .max(4, "CVC inválido")
    .regex(/^\d+$/, "Solo se permiten números"),
  installments: z.number().min(1).max(36),
});

export type CreditCardFormValues = z.infer<typeof creditCardSchema>;

export const checkoutSchema = z.object({
  address: addressSchema,
  payment: creditCardSchema,
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
