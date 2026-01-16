import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutStore } from "../../../store/checkout.store";
import type { ShippingData } from "../../../store/checkout.store";
import { InputAddress } from "../InputAddres";
import { addressSchema } from "../../../lib/validators";
import { CustomCard } from "../../shared/CustomCard";
import { CheckoutNavigation } from "./CheckoutNavigation";

export const ShippingStep = () => {
    const { setActiveStep, setShippingData, shippingData } = useCheckoutStore();

    const { register, handleSubmit, formState: { errors } } = useForm<ShippingData>({
        resolver: zodResolver(addressSchema),
        defaultValues: shippingData || undefined
    });

    const onSubmit = (data: ShippingData) => {
        setShippingData(data);
        setActiveStep('SUMMARY');
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">3. Dirección de Envío</h2>

            <CustomCard className="max-w-lg mx-auto p-6 md:p-8 border border-zinc-200 dark:border-zinc-700">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <InputAddress register={register} errors={errors} name="addressLine" placeholder="Dirección y número (Ej: Cra 43A # 1-50)" />
                        <InputAddress register={register} errors={errors} name="city" placeholder="Ciudad" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputAddress register={register} errors={errors} name="state" placeholder="Barrio / Localidad" />
                            <InputAddress register={register} errors={errors} name="postalCode" placeholder="C. Postal (Opc)" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputAddress register={register} errors={errors} name="country" placeholder="País" />
                            <InputAddress register={register} errors={errors} name="phone" placeholder="Teléfono" />
                        </div>
                    </div>

                    <CheckoutNavigation
                        onBack={() => setActiveStep('AUTH')}
                        nextLabel="Continuar"
                    />
                </form>
            </CustomCard>
        </div>
    );
};
