import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useLogin, useUser } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { CustomInput } from "../Components/shared/CustomInput";
import { CustomButton } from "../Components/shared/CustomButton";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useLogin();
  const { session, isLoading } = useUser();

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  if (isLoading) return <Loader />;

  if (session) return <Navigate to={redirectPath} />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-50" />
        
        <div className="flex flex-col items-center gap-2 mb-8">
            <h1 className="text-3xl font-black text-center text-neutral-900 dark:text-white tracking-tight">
                Iniciar sesión
            </h1>
            <p className="text-sm font-medium text-center text-neutral-500 dark:text-neutral-400">
                ¡Que bueno tenerte de vuelta!
            </p>
        </div>

        {isPending ? (
          <div className="w-full h-40 flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            <form
              className="flex flex-col gap-5 w-full"
              onSubmit={onLogin}
            >
              <CustomInput
                type="email"
                label="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
              />

              <CustomInput
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                rightElement={
                    <CustomButton
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="icon"
                        className="text-neutral-500 hover:text-primary dark:text-neutral-400"
                        title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    >
                        {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                    </CustomButton>
                }
              />

              <CustomButton
                className="w-full font-bold shadow-lg shadow-primary/20 mt-2"
                type="submit"
                effect="shine"
                variant="primary"
                size="lg"
              >
                INICIAR SESIÓN
              </CustomButton>
            </form>

            <div className="flex flex-col items-center gap-3 mt-8 pt-6 border-t border-neutral-200 dark:border-white/10">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                ¿No tienes una cuenta?
              </span>
              <Link to="/registro" className="w-full">
                <CustomButton
                    variant="ghost"
                    className="w-full font-semibold border text-black bg-black/80 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-white/5"
                    effect="wobble"
                >
                    Registrarme
                </CustomButton>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
