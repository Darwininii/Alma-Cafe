import type { ProductInput, Product } from "@/interfaces/product.interface";
import { extractFilePath, sanitizeFileName } from "../helpers";

import { supabase } from "../supabase/client";

export const getProducts = async (page: number) => {
  const itemsPerPage = 12;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const {
    data: product,
    error,
    count,
  } = await supabase
    .from("productos")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { product, count };
};

export const getFilteredProducts = async ({
  page = 1,
  brands = [],
}: {
  page: number;
  brands: string[];
}) => {
  const itemsPerPage = 12;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let query = supabase
    .from("productos")
    .select("* ", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (brands.length > 0) {
    query = query.in("brand", brands);
  }

  const { data, error, count } = await query;

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { data, count };
};

export const getRecentProducts = async () => {
  const { data: productos, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return productos as Product[];
};

export const getRandomProducts = async () => {
  const { data: productos, error } = await supabase
    .from("productos")
    .select("*")
    .limit(20);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  // Seleccionar 4 productos al azar
  const randomProducts = productos.sort(() => 0.5 - Math.random()).slice(0, 4);

  return randomProducts as Product[];
};

export const getProductBySlug = async (slug: string) => {
  // Validar que el slug no esté vacío
  if (!slug || slug.trim() === "") {
    console.error("Slug vacío o inválido:", slug);
    throw new Error("Slug no válido");
  }

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return data;
};

export const searchProducts = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .ilike("name", `%${searchTerm}%`);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return data as Product[];
};

/* ********************************** */
/*            ADMINISTRADOR           */
/* ********************************** */
export const createProduct = async (productInput: ProductInput) => {
  try {
    // 1. Crear el producto para obtener el ID
    const { data: product, error: productError } = await supabase
      .from("productos")
      .insert({
        name: productInput.name,
        brand: productInput.brand,
        slug: productInput.slug,
        features: productInput.features,
        description: productInput.description,
        price: productInput.price,
        stock: productInput.stock,
        tag: productInput.tag || null,
        images: [],
      })
      .select()
      .single();

    if (productError) throw new Error(productError.message);

    // 2. Subir las imágenes al bucket
    const folderName = product.id;

    const uploadedImages = await Promise.all(
      productInput.images.map(async (image) => {
        if (image instanceof File) {
          // Sanitizar nombre del archivo
          const cleanFileName = sanitizeFileName(image.name);
          const fileName = `${product.id}-${Date.now()}-${cleanFileName}`;
          const filePath = `${folderName}/${fileName}`;

          // Determinar contentType desde la extensión del archivo
          const ext = cleanFileName.split('.').pop()?.toLowerCase() || '';
          const contentType = ext === 'png' ? 'image/png'
            : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
              : ext === 'webp' ? 'image/webp'
                : ext === 'gif' ? 'image/gif'
                  : 'image/png'; // default

          const { data, error } = await supabase.storage
            .from("product-images")
            .upload(filePath, image, {
              cacheControl: '3600',
              upsert: false,
              contentType: contentType
            });

          if (error) {
            console.error("❌ Error uploading image:", error);
            throw new Error(error.message);
          }

          // Construir URL pública
          const imageUrl = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path).data.publicUrl;

          return imageUrl;
        }

        return image as string;
      })
    );

    // 3. Actualizar el producto con las imágenes subidas
    const { error: updatedError } = await supabase
      .from("productos")
      .update({
        images: uploadedImages,
      })
      .eq("id", product.id);

    if (updatedError) throw new Error(updatedError.message);

    return product;
  } catch (error) {
    console.log(error);
    throw new Error("Error inesperado, Vuelva a intentarlo");
  }
};

export const deleteProduct = async (productId: string) => {
  // 2. Obtener las imágenes del producto antes de eliminarlo
  const { data: productImages, error: productImagesError } = await supabase
    .from("productos")
    .select("images")
    .eq("id", productId)
    .single();

  if (productImagesError) throw new Error(productImagesError.message);

  // 3. Eliminar el producto
  const { error: productDeleteError } = await supabase
    .from("productos")
    .delete()
    .eq("id", productId);

  if (productDeleteError) throw new Error(productDeleteError.message);

  // 4. Eliminar las imágenes del bucket
  if (productImages.images.length > 0) {
    const folderName = productId;

    const paths = productImages.images.map((image) => {
      const fileName = image.split("/").pop();
      return `${folderName}/${fileName}`;
    });

    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove(paths);

    if (storageError) throw new Error(storageError.message);
  }

  return true;
};

export const updateProduct = async (
  productId: string,
  productForm: ProductInput
) => {
  // 1. Obtener las imágenes actuales del producto
  const { data: currentProduct, error: currentProductError } = await supabase
    .from("productos")
    .select("images")
    .eq("id", productId)
    .single();

  if (currentProductError) throw new Error(currentProductError.message);

  const existingImages = currentProduct.images || [];

  // 2. Actualizar la información individual del producto
  const { data: updatedProduct, error: productError } = await supabase
    .from("productos")
    .update({
      name: productForm.name,
      brand: productForm.brand,
      slug: productForm.slug,
      features: productForm.features,
      description: productForm.description,
      price: productForm.price,
      stock: productForm.stock,
      tag: productForm.tag || null,
    })
    .eq("id", productId)
    .select()
    .single();

  if (productError) throw new Error(productError.message);

  // 3. Manejo de imágenes (SUBIR NUEVAS y ELIMINAR ANTIGUAS SI ES NECESARIO)
  const folderName = productId;

  const validImages = productForm.images.filter((image) => image) as [
    File | string
  ];

  // 3.1 Identificar las imágenes que han sido eliminadas
  const imagesToDelete = existingImages.filter(
    (image) => !validImages.includes(image)
  );

  // 3.2 Obtener los paths de los archivos a eliminar
  const filesToDelete = imagesToDelete.map(extractFilePath);

  // 3.3 Eliminar las imágenes del bucket
  if (filesToDelete.length > 0) {
    const { error: deleteImagesError } = await supabase.storage
      .from("product-images")
      .remove(filesToDelete);

    if (deleteImagesError) {
      console.log(deleteImagesError);
      throw new Error(deleteImagesError.message);
    } else {
      console.log(`Imagenes eliminadas: ${filesToDelete.join(", ")}`);
    }
  }

  // 3.4 Subir las nuevas imágenes y construir el array de imágenes actualizado
  const uploadedImages = await Promise.all(
    validImages.map(async (image) => {
      if (image instanceof File) {
        // Sanitizar nombre del archivo
        const cleanFileName = sanitizeFileName(image.name);
        const fileName = `${productId}-${Date.now()}-${cleanFileName}`;
        const filePath = `${folderName}/${fileName}`;

        // Determinar contentType desde la extensión
        const ext = cleanFileName.split('.').pop()?.toLowerCase() || '';
        const contentType = ext === 'png' ? 'image/png'
          : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
            : ext === 'webp' ? 'image/webp'
              : ext === 'gif' ? 'image/gif'
                : 'image/png';

        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(filePath, image, {
            cacheControl: '3600',
            upsert: false,
            contentType: contentType
          });

        if (error) throw new Error(error.message);

        const imageUrl = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path).data.publicUrl;

        return imageUrl;
      } else if (typeof image === "string") {
        return image;
      } else {
        throw new Error("Tipo de imagen no soportado");
      }
    })
  );

  // 4. Actualizar el productos con las imagenes actualizadas
  const { error: updateImagesError } = await supabase
    .from("productos")
    .update({ images: uploadedImages })
    .eq("id", productId);

  if (updateImagesError) throw new Error(updateImagesError.message);

  return updatedProduct;
};
