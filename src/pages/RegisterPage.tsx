import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { useRegister, useUser } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { CustomInput } from "../Components/shared/CustomInput";
import { CustomButton } from "../Components/shared/CustomButton";
import { type UserRegisterFormValues, userRegisterSchema } from "../lib/validators";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserRegisterFormValues>({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            phone: "",
        },
        resolver: zodResolver(userRegisterSchema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const { mutate, isPending } = useRegister();
    const { session, isLoading } = useUser();

    const onRegister = handleSubmit((data) => {
        const { email, password, fullName, phone } = data;
        mutate({ email, password, fullName, phone });
    });

    if (isLoading) return <Loader />;

    if (session) return <Navigate to="/" />;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                <div className="flex flex-col items-center gap-2 mb-8">
                    <h1 className="text-3xl font-black text-center text-neutral-900 dark:text-white tracking-tight">
                        Regístrate
                    </h1>
                    <p className="text-sm font-medium text-center text-neutral-500 dark:text-neutral-400">
                        Crea tu cuenta para empezar
                    </p>
                </div>

                {isPending ? (
                    <div className="w-full h-40 flex justify-center items-center">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <form
                            className="flex flex-col gap-4 w-full"
                            onSubmit={onRegister}
                        >
                            <CustomInput
                                type="text"
                                label="Nombre Completo"
                                placeholder="Tu nombre"
                                {...register("fullName")}
                                error={errors.fullName?.message}
                            />

                            <CustomInput
                                type="text"
                                label="Celular"
                                placeholder="Tu número de celular"
                                {...register("phone")}
                                error={errors.phone?.message}
                            />

                            <CustomInput
                                type="email"
                                label="Correo electrónico"
                                placeholder="ejemplo@correo.com"
                                {...register("email")}
                                error={errors.email?.message}
                            />

                            <CustomInput
                                type={showPassword ? "text" : "password"}
                                label="Contraseña"
                                placeholder="Crea una contraseña segura"
                                {...register("password")}
                                error={errors.password?.message}
                                rightElement={
                                    <CustomButton
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-neutral-500 hover:text-primary dark:text-neutral-400"
                                        title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                                        aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                                    >
                                        {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                                    </CustomButton>
                                }
                            />

                            <CustomButton
                                className="w-full font-bold shadow-lg shadow-primary/20 mt-4"
                                type="submit"
                                effect="shine"
                                variant="primary"
                                size="lg"
                                aria-label="Registrarme"
                            >
                                REGISTRARME
                            </CustomButton>
                        </form>

                        <div className="flex flex-col items-center gap-3 mt-8 pt-6 border-t border-neutral-200 dark:border-white/10">
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                ¿Ya tienes una cuenta?
                            </span>
                            <Link to="/login" className="w-full">
                                <CustomButton
                                    variant="ghost"
                                    className="w-full font-semibold border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-white/5"
                                    effect="wobble"
                                    aria-label="Iniciar sesión"
                                >
                                    Iniciar sesión
                                </CustomButton>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
