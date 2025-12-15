import React from "react";
import { CustomButton } from "@/Components/shared/CustomButton";
import {
    Sparkles,
    Heart,
    ShoppingCart,
    Star,
    Zap,
    Coffee,
    ArrowRight,
    CheckCircle,
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

                            <CustomButton
                                effect="expandIcon"
                                filledIcon
                                effectColor="bg-emerald-600"
                                effectAccentColor="text-emerald-50"
                                className="bg-emerald-500 hover:bg-emerald-600"
                            >
                                Green Colors
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

                            <CustomButton
                                effect="magnetic"
                                rightIcon={CheckCircle}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                Hover to Move
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

                            <CustomButton
                                effect="shine"
                                effectColor="rgba(251, 146, 60, 0.6)"
                                rightIcon={Coffee}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                Orange Shine
                            </CustomButton>
                        </div>
                    </div>

                    {/* Efecto: pulse */}
                    <div className="mb-12 p-6 bg-white/10 dark:bg-black/30 rounded-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                            4. Pulse Effect 💓 (Continuous Pulse)
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <CustomButton
                                effect="pulse"
                                effectColor="rgba(168, 85, 247, 0.7)"
                                leftIcon={Sparkles}
                                className="bg-violet-600 hover:bg-violet-700"
                            >
                                Purple Pulse
                            </CustomButton>

                            <CustomButton
                                effect="pulse"
                                effectColor="rgba(239, 68, 68, 0.7)"
                                leftIcon={Heart}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Red Pulse
                            </CustomButton>

                            <CustomButton
                                effect="pulse"
                                effectColor="rgba(14, 165, 233, 0.7)"
                                rightIcon={Star}
                                className="bg-sky-600 hover:bg-sky-700"
                            >
                                Sky Pulse
                            </CustomButton>
                        </div>
                    </div>

                    {/* Efecto: gradient */}
                    <div className="mb-12 p-6 bg-white/10 dark:bg-black/30 rounded-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                            5. Gradient Effect 🌈 (Animated Gradient)
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <CustomButton
                                effect="gradient"
                                effectColor="#34d399"
                                effectAccentColor="#10b981"
                                rightIcon={ArrowRight}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Green Gradient
                            </CustomButton>

                            <CustomButton
                                effect="gradient"
                                effectColor="#ec4899"
                                effectAccentColor="#8b5cf6"
                                rightIcon={ArrowRight}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                Pink to Purple
                            </CustomButton>

                            <CustomButton
                                effect="gradient"
                                effectColor="#f59e0b"
                                effectAccentColor="#ef4444"
                                leftIcon={Coffee}
                                className="bg-amber-700 hover:bg-amber-800"
                            >
                                Fire Gradient
                            </CustomButton>
                        </div>
                    </div>

                    {/* Efecto: bounce */}
                    <div className="mb-12 p-6 bg-white/10 dark:bg-black/30 rounded-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                            6. Bounce Effect 🎯 (Spring Animation)
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
                                leftIcon={ShoppingCart}
                                rightIcon={ArrowRight}
                                className="bg-cyan-600 hover:bg-cyan-700"
                            >
                                Dual Icons Bounce
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

                    {/* Efecto: none (default) */}
                    <div className="mb-12 p-6 bg-white/10 dark:bg-black/30 rounded-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                            7. None Effect (Default)
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <CustomButton
                                effect="none"
                                leftIcon={Coffee}
                                className="bg-gray-700 hover:bg-gray-800"
                            >
                                Default Left Icon
                            </CustomButton>

                            <CustomButton
                                effect="none"
                                rightIcon={ArrowRight}
                                className="bg-slate-700 hover:bg-slate-800"
                            >
                                Default Right Icon
                            </CustomButton>

                            <CustomButton
                                effect="none"
                                leftIcon={Heart}
                                rightIcon={Star}
                                className="bg-zinc-700 hover:bg-zinc-800"
                            >
                                Dual Icons Default
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </section>
            {/* ============ END DEMO SECTION ============ */}
        </div>
    );
};

export default PruebasPage;
