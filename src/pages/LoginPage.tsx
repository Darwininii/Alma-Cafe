import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useLogin, useUser } from "../hooks";
import { Loader } from "../Components/shared/Loader";

import { CustomInput } from "../Components/shared/CustomInput";
import { CustomButton } from "../Components/shared/CustomButton";

export const LoginPage = () => {
  const [email, setEmail] = useState(" hola@hola.com");
  const [password, setPassword] = useState(" hola12345678");

  const { mutate, isPending } = useLogin();
  const { session, isLoading } = useUser();

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({ email, password });
  };

  if (isLoading) return <Loader />;

  if (session) return <Navigate to="/" />;

  return (
    <div className="h-full flex flex-col items-center mt-12 gap-5 transition-colors duration-300">
      <h1 className="text-4xl font-bold capitalize text-black dark:text-white">Iniciar sesión</h1>

      <p className="text-sm font-medium text-black dark:text-white">¡Que bueno tenerte de vuelta!</p>

      {isPending ? (
        <div className="w-full h-full flex justify-center mt-20">
          <Loader />
        </div>
      ) : (
        <>
          <form
            className="flex flex-col items-center gap-4 w-full mt-10 sm:w-[400px] lg:w-[500px]"
            onSubmit={onLogin}
          >
            <CustomInput
              type="email"
              label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <CustomInput
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <CustomButton
              className="bg-black dark:bg-white text-white dark:text-black uppercase font-semibold tracking-widest text-xs py-4 rounded-full mt-5 w-full hover:opacity-90 transition-opacity"
              type="submit"
              effect="shine"
            >
              Iniciar sesión
            </CustomButton>
          </form>

          <p className="text-sm text-stone-800 dark:text-gray-300">
            ¿No tienes una cuenta?
            <Link to="/registro" className="underline ml-2">
              Regístrate
            </Link>
          </p>
        </>
      )}
    </div>
  );
};
