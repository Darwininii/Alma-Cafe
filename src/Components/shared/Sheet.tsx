import { useEffect, useRef } from "react";
import { useGlobalStore } from "../../store/global.store";
import { Cart } from "./Cart";
import { Search } from "./Search";
import { FaWindowClose } from "react-icons/fa";

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
          relative bg-white text-slate-900
          h-full md:h-[90vh]
          w-[85%] sm:w-[70%] md:w-[450px]
          rounded-t-3xl md:rounded-2xl
          shadow-2xl border border-slate-200
          animate-slide-in
          overflow-y-auto
        "
      >
        {/* Header del Sheet */}
        <div className="sticky top-0 bg-white border-b border-slate-200 flex justify-between items-center px-4 py-3 rounded-t-3xl">
          <h2 className="text-lg font-semibold capitalize">
            {sheetContent === "cart"
              ? "Tu carrito"
              : sheetContent === "search"
              ? "Buscar productos"
              : ""}
          </h2>
          <button onClick={closeSheet}>
            <FaWindowClose
              size={25}
              className="text-slate-800 hover:text-slate-500 transition-colors text-xl cursor-pointer"
            />
          </button>
        </div>

        {/* Contenido dinámico */}
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};
