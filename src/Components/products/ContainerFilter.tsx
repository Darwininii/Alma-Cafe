import { useState } from "react";
import { Separator } from "../shared/Separator";
import { IoClose, IoFilter } from "react-icons/io5";


const availableBrands = [
  "Café",
  "Mecatos",
  "Galletas",
  "Xiaomi",
  "Realme",
  "Honor",
];

interface Props {
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

export const ContainerFilter = ({
  selectedBrands,
  setSelectedBrands,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-3">
      {availableBrands.map((brand) => (
        <label
          key={brand}
          className="inline-flex items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <input
            type="checkbox"
            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black focus:ring-offset-0 transition-all cursor-pointer accent-black"
            checked={selectedBrands.includes(brand)}
            onChange={() => handleBrandChange(brand)}
          />
          <span className="ml-3 text-black group-hover:text-black font-medium text-sm transition-colors select-none">
            {brand}
          </span>
        </label>
      ))}
    </div>
  );

  return (
    <>
      {/* Botón para Móvil */}
      <div className="col-span-2 lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex cursor-pointer items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg w-full justify-center font-medium shadow-sm hover:bg-gray-800 transition-colors"
        >
          <IoFilter size={20} />
          Filtrar Productos
        </button>
      </div>

      {/* Drawer Móvil (Overlay + Content) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay oscuro */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel Lateral */}
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white/20 backdrop-blur-xl shadow-2xl p-6 transition-transform transform translate-x-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-black">Filtros</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black rounded-full transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            <Separator />

            <div className="mt-6">
              <h3 className="font-semibold text-black mb-4">Filtrar Por Tipo</h3>
              <FilterContent />
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-8 w-full cursor-pointer bg-black hover:bg-gray-800 transition-colors text-white py-3 rounded-lg font-medium"
            >
              Ver Resultados
            </button>
          </div>
        </div>
      )}

      {/* Vista Desktop (Sidebar estático) */}
      <div className="hidden lg:block bg-white/10 backdrop-blur-xl p-6 border border-gray-100 rounded-2xl shadow-sm h-fit col-span-2 lg:col-span-1 border-t-4 border-t-black">
        <h3 className="font-bold text-xl text-black mb-4">Filtros</h3>

        <Separator />

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="font-semibold text-black mb-3">Marcas</h3>
            <FilterContent />
          </div>
        </div>
      </div>
    </>
  );
};
