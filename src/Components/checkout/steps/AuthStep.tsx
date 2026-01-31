import { useEffect, useState } from "react";
import { useCheckoutStore } from "../../../store/checkout.store";
import { CustomButton } from "../../shared/CustomButton";
import { CustomInput } from "../../shared/CustomInput";
import { CustomCard } from "../../shared/CustomCard";
import { CustomDivider } from "../../shared/CustomDivider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "../../shared/Loader";
import { MdEmail, MdPerson, MdPhone } from "react-icons/md";
import { CheckoutNavigation } from "./CheckoutNavigation";
import { useUser } from "../../../hooks/auth/useUser"; // Import useUser
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Schema for Guest Form
const guestSchema = z.object({
    email: z.string().email("Email inválido"),
    fullName: z.string().min(3, "Nombre completo requerido"),
    phone: z.string().min(10, "Celular requerido (mín. 10 dígitos)")
});

type GuestForm = z.infer<typeof guestSchema>;

export const AuthStep = () => {
    const { setActiveStep, setPayer } = useCheckoutStore();
    const { session, isLoading: isLoadingSession } = useUser(); // Use hook
    const navigate = useNavigate(); // Use navigate
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form logic
    const { register, handleSubmit, formState: { errors } } = useForm<GuestForm>({
        resolver: zodResolver(guestSchema)
    });

    useEffect(() => {
        const checkUser = async () => {
            if (isLoadingSession) return; // Wait for session load

            if (session?.user) {
                const supabase = (await import("../../../supabase/client")).supabase;
                const user = session.user;

                // Fetch customer data for name
                const { data: customer } = await supabase
                    .from('customers')
                    .select('full_name, phone')
                    .eq('user_id', user.id)
                    .single();

                const fullName = customer?.full_name || user.user_metadata?.full_name || '';
                const phone = customer?.phone || user.user_metadata?.phone || '';

                setUser({ ...user, full_name: fullName, phone });
                setPayer({ email: user.email!, fullName, phone });
            }
            setLoading(false);
        };
        checkUser();
    }, [setPayer, session, isLoadingSession]);

    const onGuestSubmit = (data: GuestForm) => {
        setPayer({ email: data.email, fullName: data.fullName, phone: data.phone });
        setActiveStep('SHIPPING');
    };

    const handleContinueLoggedIn = () => {
        // Ensure payer is set (it should be from useEffect, but safe to re-set if needed or just proceed)
        // If user changed some profile info, we might want to refetch? For now simply proceed.
        setActiveStep('SHIPPING');
    }

    if (loading || isLoadingSession) return <div className="p-10 flex justify-center"><Loader /></div>;

    if (user) {
        return (
            <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">2. Datos del Comprador</h2>
                <CustomCard className="p-6 border border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200">
                            <MdPerson size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-black dark:text-zinc-400">Comprando como:</p>
                            {user.full_name && <p className="font-bold text-sm text-black dark:text-zinc-300">Nombre: {user.full_name}</p>}
                            <p className="font-bold text-sm text-black dark:text-white">Email: {user.email}</p>
                            {user.phone && <p className="font-bold text-sm text-black dark:text-gray-400">Celular: {user.phone}</p>}
                        </div>
                    </div>
                </CustomCard>
                <CheckoutNavigation
                    onBack={() => setActiveStep('CART')}
                    onNext={handleContinueLoggedIn}
                    nextLabel="Continuar"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">2. Datos del Comprador</h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Login Option */}
                <CustomCard className="p-8 border border-zinc-100 bg-white shadow-xl dark:bg-zinc-900/50 dark:border-white/10 dark:shadow-none transition-all hover:border-primary/60 dark:hover:border-primary/50 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                    
                    <h3 className="font-bold text-xl mb-3 text-zinc-900 dark:text-white">¿Ya tienes cuenta?</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
                        Inicia sesión para usar tus direcciones guardadas, revisar tu historial y acumular puntos en cada compra.
                    </p>
                    <CustomButton
                        variant="outline"
                        className="w-full border-black/40 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-900 dark:text-white group-hover:border-primary/50 transition-colors"
                        onClick={() => navigate('/login?redirect=/checkout')}
                    >
                        Iniciar Sesión
                    </CustomButton>
                </CustomCard>

                {/* Guest Option */}
                <CustomCard className="p-8 border border-zinc-100 bg-white shadow-xl dark:bg-zinc-900/50 dark:border-white/10 dark:shadow-none transition-all relative">
                    <h3 className="font-bold text-xl mb-3 text-zinc-900 dark:text-white">Compra rápida</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                        Continua como invitado. Solo necesitamos tus datos básicos para enviarte los detalles del pedido.
                    </p>

                    <form onSubmit={handleSubmit(onGuestSubmit)} className="space-y-5">
                        <CustomInput
                            label="Email"
                            type="email"
                            placeholder="tu@email.com"
                            icon={<MdEmail size={20} />}
                            {...register('email')}
                            error={errors.email?.message}
                            wrapperClassName="border-black/40 dark:border-white/20"
                        />

                        <CustomInput
                            label="Nombre Completo"
                            placeholder="Juan Pérez"
                            icon={<MdPerson size={20} />}
                            {...register('fullName')}
                            error={errors.fullName?.message}
                            wrapperClassName="border-black/40 dark:border-white/20"
                        />

                        <CustomInput
                            label="Celular"
                            placeholder="300 123 4567"
                            icon={<MdPhone size={20} />}
                            {...register('phone')}
                            error={errors.phone?.message}
                            wrapperClassName="border-black/40 dark:border-white/20"
                        />

                        <CustomDivider className="my-8 bg-black/50 dark:bg-white/20"/>

                        <CheckoutNavigation
                            onBack={() => setActiveStep('CART')}
                            nextLabel="Continuar como invitado"
                            className="border-none mt-2 pt-0"
                        />
                    </form>
                </CustomCard>
            </div>
        </div>
    );
};
