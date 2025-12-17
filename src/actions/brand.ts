import { supabase } from "@/supabase/client";
import type { Brand, BrandInput } from "@/interfaces/brand.interface";

export const getBrands = async () => {
    const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching brands:", error);
        throw new Error(error.message);
    }

    return data as Brand[];
};

export const createBrand = async (brand: BrandInput) => {
    const { data, error } = await supabase
        .from("brands")
        .insert(brand)
        .select()
        .single();

    if (error) {
        console.error("Error creating brand:", error);
        throw new Error(error.message);
    }

    return data as Brand;
};

export const updateBrand = async (id: string, brand: BrandInput) => {
    const { data, error } = await supabase
        .from("brands")
        .update(brand)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating brand:", error);
        throw new Error(error.message);
    }

    return data as Brand;
};

export const deleteBrand = async (id: string) => {
    const { error } = await supabase.from("brands").delete().eq("id", id);

    if (error) {
        console.error("Error deleting brand:", error);
        throw new Error(error.message);
    }

    return true;
};
