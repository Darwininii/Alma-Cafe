import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

export const ThemeListener = () => {
    const { generateGradientCSS, colors, type, direction, fetchTheme, theme } = useThemeStore();

    // Hydrate from Supabase on mount & Sync Dark Mode
    useEffect(() => {
        fetchTheme();
        // Sync class on mount/change
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [fetchTheme, theme]);

    useEffect(() => {
        // Solo actualizar el gradiente light con los colores dinámicos
        const gradient = generateGradientCSS();
        document.documentElement.style.setProperty('--bg-gradient-light', gradient);

        // Actualizar el gradiente activo según el tema actual
        if (theme === "dark") {
            // En modo dark, usar el gradiente oscuro predefinido
            const darkGradient = 'radial-gradient(125% 125% at 50% 10%, #1a0a1f 20%, #0f0515 50%, #000000 100%)';
            document.documentElement.style.setProperty('--active-bg-gradient', darkGradient);
        } else {
            // En modo light, usar el gradiente generado dinámicamente
            document.documentElement.style.setProperty('--active-bg-gradient', gradient);
        }

    }, [colors, type, direction, generateGradientCSS, theme]);

    return null; // This component doesn't render anything
};
