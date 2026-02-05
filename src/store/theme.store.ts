import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/supabase/client";

export type GradientType = "linear" | "radial";
export type Direction = "top" | "right" | "bottom" | "left" | "center";
export type ThemeMode = "light" | "dark";

interface ThemeSettings {
  colors: string[];
  type: GradientType;
  direction: Direction;
}

interface ThemeState extends ThemeSettings {
  theme: ThemeMode;
  isLoading: boolean;
  
  // Actions
  toggleTheme: () => void;
  setColors: (colors: string[]) => void;
  setType: (type: GradientType) => void;
  setDirection: (direction: Direction) => void;
  
  // Async Actions
  fetchTheme: () => Promise<void>;
  saveTheme: (settings: ThemeSettings) => Promise<boolean>;

  // Helpers
  generateGradientCSS: () => string;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light", 
      colors: ["#c69c6d", "#ab7061", "#3c1053"], // Default Light Theme colors
      type: "radial",
      direction: "center",
      isLoading: false,
      
      toggleTheme: () => {
         const { theme } = get();
         const newTheme = theme === "light" ? "dark" : "light";
         
         // Side Effect: Toggle DOM class
         if (newTheme === "dark") {
           document.documentElement.classList.add("dark");
         } else {
           document.documentElement.classList.remove("dark");
         }
         
         set({ theme: newTheme });
      },

      setColors: (colors) => set({ colors }),
      setType: (type) => set({ type }),
      setDirection: (direction) => set({ direction }),

      fetchTheme: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "theme")
            .single();

          if (error) {
             console.error("Error fetching theme:", error);
             return;
          }

          if (data && data.value) {
            // Assert type safely
            const settings = data.value as unknown as ThemeSettings;
            set({ 
              colors: settings.colors || ["#c69c6d", "#ab7061", "#3c1053"],
              type: settings.type || "radial",
              direction: settings.direction || "center"
            });
          }
        } catch (err) {
          console.error("Unexpected error fetching theme:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      saveTheme: async (newSettings: ThemeSettings) => {
        set({ isLoading: true });
        try {
          // Optimistic update
          set({ ...newSettings });

          const { error } = await supabase
            .from("site_settings")
            .upsert({ 
              key: "theme", 
              value: newSettings as any // Force cast to Json compatible type
            });

          if (error) {
            console.error("Error saving theme:", error);
            return false;
          }
          return true;
        } catch (err) {
          console.error("Unexpected error saving theme:", err);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      generateGradientCSS: () => {
        const { colors, type, direction } = get();
        
        // Distribuir porcentajes equitativamente
        const colorString = colors.map((color, index) => {
            const percentage = colors.length === 1 ? 100 : Math.round((index / (colors.length - 1)) * 100);
            return `${color} ${percentage}%`;
        }).join(", ");

        if (type === "radial") {
          let position = "50% 50%";
          if (direction === "top") position = "50% 10%";
          if (direction === "bottom") position = "50% 90%";
          if (direction === "left") position = "10% 50%";
          if (direction === "right") position = "90% 50%";
          if (direction === "center") position = "50% 50%";

          return `radial-gradient(125% 125% at ${position}, ${colorString})`;
        } else {
          let deg = "180deg"; 
          if (direction === "top") deg = "0deg";
          if (direction === "right") deg = "90deg";
          if (direction === "bottom") deg = "180deg";
          if (direction === "left") deg = "270deg";
          
          return `linear-gradient(${deg}, ${colorString})`;
        }
      },
    }),
    {
      name: "theme-storage", 
    }
  )
);
