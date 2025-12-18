import React from "react";
import { CustomButton } from "@/Components/shared/CustomButton";
import { GooeyMenu } from "@/Components/shared/GooeyMenu";
import {
    Sparkles,
    Heart,
    ShoppingCart,
    Star,
    Zap,
    Coffee,
    ArrowRight,
    CheckCircle,
    Share2,
    Mail,
    MessageCircle,
    Settings,
    Plus,
    BarChart3,
} from "lucide-react";

export const PruebasPage: React.FC = () => {
    return (
        <div className="min-h-screen pt-20 pb-10">
            {/* ============ DEMO SECTION - CustomButton Effects ============ */}
            <section className="py-16 px-4 bg-white/5 dark:bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white">
                        🎨 CustomButton Effects Demo
                    </h2>

                    {/* Efecto: expandIcon */}
                    <div className="mb-12 p-6 bg-white/10 dark:bg-black/30 rounded-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                            1. ExpandIcon Effect
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <CustomButton
                                effect="expandIcon"
                                filledIcon
                                effectColor="bg-amber-800/80"
                                effectAccentColor="text-white"
                                className="bg-amber-600 hover:bg-amber-700"
                            >
                                Amber Colors
                            </CustomButton>

                            <CustomButton
                                effect="expandIcon"
                                filledIcon
                                effectColor="bg-blue-600"
                                effectAccentColor="text-blue-100"
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Blue Colors
                            </CustomButton>
                        </div>
                    </div>

                    {/* Efecto: magnetic */}
                    <div className="mb-12 p-6 bg-white/10 dark:bg-black/30 rounded-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                            2. Magnetic Effect 🧲 (Follows Cursor)
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <CustomButton
                                effect="magnetic"
                                leftIcon={Star}
                                className="bg-yellow-600 hover:bg-yellow-700"
                            >
                                Magnetic Button
                            </CustomButton>

                            <CustomButton
                                effect="magnetic"
                                leftIcon={Sparkles}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                Follow Me
                            </CustomButton>
                        </div>
                    </div>

                    {/* Efecto: shine */}
                    <div className="mb-12 p-6 bg-white/10 dark:bg-black/30 rounded-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                            3. Shine Effect ✨ (Diagonal Shimmer)
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <CustomButton
                                effect="shine"
                                effectColor="rgba(59, 130, 246, 0.6)"
                                leftIcon={Zap}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Blue Shine
                            </CustomButton>

                            <CustomButton
                                effect="shine"
                                effectColor="rgba(255, 255, 255, 0.6)"
                                leftIcon={Heart}
                                className="bg-pink-600 hover:bg-pink-700"
                            >
                                Pink Shine
                            </CustomButton>
                        </div>
                    </div>

                    {/* Efecto: bounce */}
                    <div className="mb-12 p-6 bg-white/10 dark:bg-black/30 rounded-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                            4. Bounce Effect 🎯 (Spring Animation)
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <CustomButton
                                effect="bounce"
                                leftIcon={Heart}
                                className="bg-rose-600 hover:bg-rose-700"
                            >
                                Bounce Me
                            </CustomButton>

                            <CustomButton
                                effect="bounce"
                                rightIcon={Star}
                                className="bg-fuchsia-600 hover:bg-fuchsia-700"
                            >
                                Spring Bounce
                            </CustomButton>
                        </div>
                    </div>

                    {/* ============ USER REQUESTED EFFECTS ============ */}
                    <div className="my-16 border-t border-black/10 dark:border-white/10 pt-16">
                        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">
                            ✨ Special Requested Effects
                        </h2>

                        {/* 1. Neon Pulse */}
                        <div className="mb-12 p-10 bg-[#0a0a0a] rounded-xl flex flex-col items-center">
                            <h3 className="text-2xl font-semibold mb-8 text-white">
                                1. Neon Pulse (CSS Animation)
                            </h3>
                            <div className="flex flex-wrap gap-12 justify-center">
                                <CustomButton effect="neonPulse" className="min-w-[200px]" effectColor="#0ff">
                                    Neon Cyan
                                </CustomButton>

                                <CustomButton effect="neonPulse" className="min-w-[200px]" effectColor="#f0f">
                                    Neon Magenta
                                </CustomButton>
                            </div>
                        </div>

                        {/* 2. Wobble */}
                        <div className="mb-12 p-6 bg-white/10 dark:bg-black/30 rounded-xl flex flex-col items-center">
                            <h3 className="text-2xl font-semibold mb-8 text-black dark:text-white">
                                2. Wobble Effect
                            </h3>
                            <div className="flex flex-wrap gap-8 justify-center">
                                <CustomButton effect="wobble" className="bg-[#e74c3c] hover:bg-[#c0392b] text-white min-w-[150px]">
                                    Wobble Red
                                </CustomButton>

                                <CustomButton effect="wobble" leftIcon={Star} className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[150px]">
                                    Shake it!
                                </CustomButton>
                            </div>
                        </div>

                        {/* 3. 3D Rotating Button */}
                        <div className="mb-12 p-20 bg-gray-100 dark:bg-neutral-800 rounded-xl flex flex-col items-center overflow-hidden">
                            <h3 className="text-2xl font-semibold mb-12 text-black dark:text-white">
                                3. 3D Rotating Button
                            </h3>
                            <div className="flex flex-wrap gap-16 justify-center pl-10">
                                {/* Need extra space for rotation */}
                                <CustomButton effect="3d" size="lg" className="w-[180px]">
                                    Rotate Me
                                </CustomButton>

                                <CustomButton effect="3d" size="lg" className="w-[180px]" leftIcon={Zap}>
                                    Power 3D
                                </CustomButton>
                            </div>
                        </div>

                    </div>

                    {/* ============ EFECTOS SORPRENDENTES E INNOVADORES ============ */}
                    <div className="my-16 border-t border-black/10 dark:border-white/10 pt-16">
                        <h2 className="text-5xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 animate-pulse">
                            ✨ Efectos Innovadores y Sorprendentes ✨
                        </h2>
                        <p className="text-center text-black/70 dark:text-white/70 mb-16 max-w-3xl mx-auto text-lg font-medium">
                            ¡Prepárate para lo INESPERADO! Efectos únicos que te dejarán con la boca abierta 🚀
                        </p>

                        {/* 1. Magnetic Pull */}
                        <div className="mb-16 p-10 bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-violet-900/40 border border-blue-500/30 rounded-2xl shadow-2xl">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="text-4xl">🧲</span>
                                <h3 className="text-3xl font-bold text-white">
                                    Magnetic Pull Attraction
                                </h3>
                            </div>
                            <p className="text-white/80 mb-8 text-lg">
                                ¡El contenido del botón es atraído magnéticamente por tu cursor! Mueve el mouse sobre el botón y observa
                            </p>
                            <div className="flex flex-wrap gap-8 justify-center">
                                <CustomButton effect="magneticPull" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8" leftIcon={Star}>
                                    Attract Me
                                </CustomButton>
                                <CustomButton effect="magneticPull" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8" rightIcon={Sparkles}>
                                    Magnetic Field
                                </CustomButton>
                                <CustomButton effect="magneticPull" size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-10">
                                    Pull Effect
                                </CustomButton>
                            </div>
                        </div>

                        {/* 2. Text Scramble */}
                        <div className="mb-16 p-10 bg-gradient-to-br from-green-900/30 via-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-2xl shadow-2xl">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="text-4xl">🔤</span>
                                <h3 className="text-3xl font-bold text-white">
                                    Text Scramble Matrix
                                </h3>
                            </div>
                            <p className="text-white/80 mb-8 text-lg">
                                El texto se descompone en caracteres aleatorios tipo Matrix y luego se reconstruye letra por letra
                            </p>
                            <div className="flex flex-wrap gap-8 justify-center">
                                <CustomButton effect="textScramble" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8">
                                    Decrypt Message
                                </CustomButton>
                                <CustomButton effect="textScramble" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8" leftIcon={Zap}>
                                    Hack The System
                                </CustomButton>
                                <CustomButton effect="textScramble" size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-10">
                                    Random Characters
                                </CustomButton>
                            </div>
                        </div>

                        {/* 3. Liquid Metal */}
                        <div className="mb-16 p-10 bg-gradient-to-br from-gray-900/50 via-slate-900/50 to-zinc-900/50 border border-gray-400/30 rounded-2xl shadow-2xl">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="text-4xl">🌊</span>
                                <h3 className="text-3xl font-bold text-white">
                                    Liquid Metal Chrome
                                </h3>
                            </div>
                            <p className="text-white/80 mb-8 text-lg">
                                Reflejo metálico líquido que sigue tu cursor con reflejos cromados realistas
                            </p>
                            <div className="flex flex-wrap gap-8 justify-center">
                                <CustomButton effect="liquidMetal" className="bg-gray-700 hover:bg-gray-800 text-white text-lg px-8" leftIcon={Star}>
                                    Chrome Shine
                                </CustomButton>
                                <CustomButton effect="liquidMetal" className="bg-slate-700 hover:bg-slate-800 text-white text-lg px-8">
                                    Metallic Flow
                                </CustomButton>
                                <CustomButton effect="liquidMetal" size="lg" className="bg-zinc-700 hover:bg-zinc-800 text-white px-10" rightIcon={Sparkles}>
                                    Liquid Reflection
                                </CustomButton>
                            </div>
                        </div>

                        {/* 4. Pixel Dissolve */}
                        <div className="mb-16 p-10 bg-gradient-to-br from-red-900/40 via-rose-900/40 to-pink-900/40 border border-red-500/30 rounded-2xl shadow-2xl">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="text-4xl">🎭</span>
                                <h3 className="text-3xl font-bold text-white">
                                    Pixel Dissolve Gravity
                                </h3>
                            </div>
                            <p className="text-white/80 mb-8 text-lg">
                                ¡Los píxeles del texto se descomponen y caen por gravedad con rotación! Se reconstruye después
                            </p>
                            <div className="flex flex-wrap gap-8 justify-center">
                                <CustomButton effect="pixelDissolve" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8" leftIcon={Zap}>
                                    Dissolve Text
                                </CustomButton>
                                <CustomButton effect="pixelDissolve" className="bg-rose-600 hover:bg-rose-700 text-white text-lg px-8">
                                    Pixel Rain
                                </CustomButton>
                                <CustomButton effect="pixelDissolve" size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-10" rightIcon={Star}>
                                    Gravity Effect
                                </CustomButton>
                            </div>
                        </div>

                        {/* 5. Cosmic Ripple */}
                        <div className="mb-16 p-10 bg-gradient-to-br from-pink-900/40 via-fuchsia-900/40 to-purple-900/40 border border-pink-500/30 rounded-2xl shadow-2xl">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="text-4xl">🌌</span>
                                <h3 className="text-3xl font-bold text-white">
                                    Cosmic Ripple Universe
                                </h3>
                            </div>
                            <p className="text-white/80 mb-8 text-lg">
                                Ondas cósmicas expansivas con estrellas que aparecen - ¡Es como tener el espacio en un botón!
                            </p>
                            <div className="flex flex-wrap gap-8 justify-center">
                                <CustomButton effect="cosmicRipple" leftIcon={Star}>
                                    Cosmic Wave
                                </CustomButton>
                                <CustomButton effect="cosmicRipple" rightIcon={Sparkles}>
                                    Star Burst
                                </CustomButton>
                                <CustomButton effect="cosmicRipple" size="lg" className="px-10">
                                    Universe Ripple
                                </CustomButton>
                            </div>
                        </div>

                    </div>

                    {/* ============ GOOEY MENU SECTION ============ */}
                    <div className="my-16 border-t border-black/10 dark:border-white/10 pt-16">
                        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                            🎨 Gooey Hamburger Menu
                        </h2>

                        {/* Gooey Menu Demo */}
                        <div className="mb-12 p-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex flex-col items-center">
                            <h3 className="text-2xl font-semibold mb-8 text-white">
                                Interactive Radial Menu with Gooey Effect
                            </h3>
                            <p className="text-white/90 mb-12 text-center max-w-md">
                                Click the button to expand the menu. The gooey effect is created using SVG filters.
                            </p>

                            <GooeyMenu
                                items={[
                                    { icon: BarChart3, label: "Analytics", onClick: () => alert("Analytics!") },
                                    { icon: Plus, label: "Add New", onClick: () => alert("Add New!") },
                                    { icon: Heart, label: "Favorites", onClick: () => alert("Favorites!") },
                                    { icon: Mail, label: "Messages", onClick: () => alert("Messages!") },
                                    { icon: Settings, label: "Settings", onClick: () => alert("Settings!") },
                                    { icon: Share2, label: "Share", onClick: () => alert("Share!") },
                                ]}
                                buttonColor="bg-pink-600"
                                itemColor="bg-pink-600"
                            />
                        </div>

                        {/* Variation with different colors */}
                        <div className="mb-12 p-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex flex-col items-center">
                            <h3 className="text-2xl font-semibold mb-8 text-white">
                                Different Color Variation
                            </h3>

                            <GooeyMenu
                                items={[
                                    { icon: MessageCircle, label: "Chat", onClick: () => console.log("Chat") },
                                    { icon: Star, label: "Starred", onClick: () => console.log("Starred") },
                                    { icon: Coffee, label: "Coffee", onClick: () => console.log("Coffee") },
                                    // { icon: Zap, label: "Quick Action", onClick: () => console.log("Quick") },
                                ]}
                                buttonColor="bg-amber-500"
                                itemColor="bg-amber-500"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PruebasPage;
