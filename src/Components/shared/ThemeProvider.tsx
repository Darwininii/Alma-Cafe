import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const theme = useThemeStore((state) => state.theme);
    const setTheme = useThemeStore((state) => state.setTheme);

    useEffect(() => {
        // Initialize theme on mount - check localStorage first
        const storedTheme = localStorage.getItem("theme-storage");
        if (storedTheme) {
            try {
                const parsed = JSON.parse(storedTheme);
                const savedTheme = parsed.state?.theme || "light";

                // Apply the saved theme to document
                if (savedTheme === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }

                // Sync with store if needed
                if (savedTheme !== theme) {
                    setTheme(savedTheme);
                }
            } catch (e) {
                console.error("Failed to parse theme from storage", e);
            }
        } else {
            // No stored theme, ensure light mode
            document.documentElement.classList.remove("dark");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    useEffect(() => {
        // Apply theme when it changes
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return <>{children}</>;
};
