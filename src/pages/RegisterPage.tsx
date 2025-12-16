import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { useRegister, useUser } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { CustomInput } from "../Components/shared/CustomInput";
import { CustomButton } from "../Components/shared/CustomButton";
import {
  type UserRegisterFormValues,
  userRegisterSchema,
} from "../lib/validators";

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

  const { mutate, isPending } = useRegister();
  const { session, isLoading } = useUser();

  const onRegister = handleSubmit((data) => {
    const { email, password, fullName, phone } = data;

    mutate({ email, password, fullName, phone });
  });

  if (isLoading) return <Loader />;

  if (session) return <Navigate to="/" />;

  return (
    <div className="h-full flex flex-col items-center mt-12 gap-5 transition-colors duration-300">
      <h1 className="text-4xl font-bold capitalize text-black dark:text-white">Regístrate</h1>

      <p className="text-sm font-medium text-black dark:text-white">
        Por favor, rellene los siguientes campos:
      </p>

      {isPending ? (
        <div className="w-full h-full flex justify-center mt-20">
          <Loader />
        </div>
      ) : (
        <>
          <form
            className="flex flex-col items-center gap-4 w-full mt-10 sm:w-[400px] lg:w-[500px]"
            onSubmit={onRegister}
          >
            <CustomInput
              type="text"
              label="Nombre Completo"
              {...register("fullName")}
              error={errors.fullName?.message}
            />

            <CustomInput
              type="text"
              label="Celular"
              {...register("phone")}
              error={errors.phone?.message}
            />

            <CustomInput
              type="email"
              label="Correo electrónico"
              {...register("email")}
              error={errors.email?.message}
            />

            <CustomInput
              type="password"
              label="Contraseña"
              {...register("password")}
              error={errors.password?.message}
            />

            <CustomButton
              className="bg-black dark:bg-white text-white dark:text-black uppercase font-semibold tracking-widest text-xs py-4 rounded-full mt-5 w-full hover:opacity-90 transition-opacity"
              type="submit"
              effect="shine"
            >
              Registrarme
            </CustomButton>
          </form>

          <p className="text-sm text-stone-800 dark:text-gray-300">
            ¿Ya tienes una cuenta?
            <Link to="/registro" className="underline ml-2">
              Inicia sesión
            </Link>
          </p>
        </>
      )}
    </div>
  );
};
