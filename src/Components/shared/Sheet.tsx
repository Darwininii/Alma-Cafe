import { useEffect, useRef } from "react";
import { useGlobalStore } from "../../store/global.store";
import { Cart } from "./Cart";
import { Search } from "./Search";
import { CustomClose } from "./CustomClose";

export const Sheet = () => {
  const sheetContent = useGlobalStore((state) => state.sheetContent);
  const closeSheet = useGlobalStore((state) => state.closeSheet);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(event.target as Node)
      ) {
        closeSheet();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [closeSheet]);

  const renderContent = () => {
    switch (sheetContent) {
      case "cart":
        return <Cart />;
      case "search":
        return <Search />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-stretch md:items-center">
      {/* Fondo oscuro difuminado */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeSheet}
      />

      {/* Panel */}
      <div
        ref={sheetRef}
        className="
          relative bg-white/10 dark:bg-black/20 backdrop-blur-xl text-slate-900 dark:text-white/70
          h-full md:h-[90vh]
          w-[85%] sm:w-[70%] md:w-[450px]
          rounded-t-3xl md:rounded-2xl
          shadow-2xl shadow-black/10 border border-white/20 dark:border-white/10
          animate-slide-in
          overflow-y-auto
        "
      >
        {/* Inner glow for glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-t-3xl md:rounded-2xl" />
        {/* Header del Sheet */}
        <div className="sticky top-0 bg-white/30 dark:bg-black/30 backdrop-blur-lg border-b border-white/20 dark:border-white/15 flex justify-between items-center px-4 py-3 rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black capitalize text-black dark:text-white">
              {sheetContent === "cart"
                ? "Tu carrito"
                : sheetContent === "search"
                  ? "Buscar productos"
                  : sheetContent === "recent"
                    ? "Vistos recientemente"
                    : ""}
            </h2>
          </div>
          <CustomClose
            onClick={closeSheet}
            className="text-black dark:text-white hover:text-rose-700 dark:hover:text-rose-400 bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
            title="Cerrar Ventana"
          />
        </div>

        {/* Contenido dinámico */}
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};
