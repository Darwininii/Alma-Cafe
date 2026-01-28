import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { CustomButton } from "./CustomButton";
import { CustomClose } from "./CustomClose";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  variant?: "danger" | "success" | "info" | "warning"; // Define el estilo visual
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

const variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
};

const iconMap = {
  danger: <AlertTriangle size={24} className="text-red-500" />,
  success: <CheckCircle size={24} className="text-green-500" />,
  warning: <AlertTriangle size={24} className="text-yellow-500" />,
  info: <Info size={24} className="text-blue-500" />,
};

const colorMap = {
  danger: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
  success: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
  warning: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
  info: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
};

export const CustomModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = "info",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  children,
  isLoading = false,
}: CustomModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl ${colorMap[variant]}`}>
                  {iconMap[variant]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {title}
                  </h3>
                  {description && (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              <CustomClose 
                onClick={onClose} 
                disabled={isLoading}
              />
            </div>

            {/* Body */}
            {children && <div className="px-6 pb-6">{children}</div>}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
              <CustomButton
                onClick={onClose}
                disabled={isLoading}
                variant="outline"
                className="text-sm"
              >
                {cancelText}
              </CustomButton>
              {onConfirm && (
                <CustomButton
                  onClick={onConfirm}
                  isLoading={isLoading}
                  className={`text-sm ${
                    variant === "danger"
                      ? "bg-red-600 hover:bg-red-700 text-white border-none"
                      : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  }`}
                >
                  {confirmText}
                </CustomButton>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
