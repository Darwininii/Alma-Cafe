import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

export const ThemeListener = () => {
    const { generateGradientCSS, colors, type, direction, fetchTheme, theme } = useThemeStore();

    // Hydrate from Supabase on mount & Sync Dark Mode
    useEffect(() => {
        fetchTheme();
        fetchTheme();
    }, [fetchTheme, theme]);
    
    useEffect(() => {
        // Sync class on mount/change with rAF to avoid reflows
        requestAnimationFrame(() => {
             if (theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        });
    }, [theme]);

    useEffect(() => {
        // Wrap style updates in requestAnimationFrame to avoid forced reflows
        requestAnimationFrame(() => {
            const gradient = generateGradientCSS();
            document.documentElement.style.setProperty('--bg-gradient-light', gradient);

            if (theme === "dark") {
                const darkGradient = 'radial-gradient(125% 125% at 50% 10%, #1a0a1f 20%, #0f0515 50%, #000000 100%)';
                document.documentElement.style.setProperty('--active-bg-gradient', darkGradient);
            } else {
                document.documentElement.style.setProperty('--active-bg-gradient', gradient);
            }
        });
    }, [colors, type, direction, generateGradientCSS, theme]);

    return null; // This component doesn't render anything
};
