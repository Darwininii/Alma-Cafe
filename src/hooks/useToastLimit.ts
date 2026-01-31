import { useToasterStore, toast } from "react-hot-toast";
import { useEffect } from "react";

export const useToastLimit = (limit: number) => {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only count visible toasts
      .filter((_, i) => i >= limit) // Identify those exceeding the limit
      .forEach((t) => toast.dismiss(t.id)); // Dismiss them
  }, [toasts, limit]);
};
