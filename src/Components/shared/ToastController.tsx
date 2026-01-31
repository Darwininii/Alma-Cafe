import { useToastLimit } from "@/hooks/useToastLimit";

export const ToastController = () => {
    useToastLimit(1); // Enforce only 1 visible toast
    return null;
};
