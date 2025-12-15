import { useState } from "react";
import { Separator } from "../shared/Separator";
import { IoCheckmark } from "react-icons/io5";
import { CustomButton } from "../shared/CustomButton";
import { MdOutlineFilterList, MdOutlineFilterListOff } from "react-icons/md";
import { CustomDeleteButton } from "../shared/CustomDeleteButton";
import { CustomClose } from "../shared/CustomClose";


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
          className="relative inline-flex items-center group cursor-pointer hover:bg-white/30 dark:hover:bg-white/5 p-2 rounded-lg transition-all"
        >
          <input
            type="checkbox"
            className="sr-only peer"
            checked={selectedBrands.includes(brand)}
            onChange={() => handleBrandChange(brand)}
          />
          {/* Custom Checkbox */}
          <div className="relative w-5 h-5 bg-white dark:bg-gray-800 border-2 border-black/70 dark:border-white/70 rounded-md transition-all duration-300 peer-checked:bg-gradient-to-br peer-checked:from-rose-500 peer-checked:to-rose-600 dark:peer-checked:from-rose-600 dark:peer-checked:to-rose-700 peer-checked:border-rose-500 dark:peer-checked:border-rose-600 peer-focus:ring-2 peer-focus:ring-rose-500/20 dark:peer-focus:ring-rose-400/20 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-gray-900">
            {/* Checkmark */}
            <IoCheckmark className="absolute inset-0 w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-all duration-200 scale-0 peer-checked:scale-100" />
          </div>
          <span className="ml-3 text-black dark:text-white/70 group-hover:text-rose-600 dark:group-hover:text-rose-400 font-bold text-sm transition-colors select-none peer-checked:text-rose-600 dark:peer-checked:text-rose-400 peer-checked:font-semibold">
            {brand}
          </span>
        </label>
      ))}
    </div>
  );

  return (
    <>
      {/* Botón para Móvil */}
      <div className="col-span-2 lg:hidden flex gap-3">
        <CustomButton
          onClick={() => setIsOpen(true)}
          className="flex-1 bg-black dark:bg-white/80 text-white dark:text-black font-black"
          size="md"
          rightIcon={MdOutlineFilterList}
          iconSize={22}
          effect="shine"
        >
          Filtrar Productos
        </CustomButton>
        <CustomDeleteButton
          onClick={() => setSelectedBrands([])}
          title="Limpiar filtros"
          aria-label="Limpiar filtros"
          centerIcon={MdOutlineFilterListOff}
        />
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
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl shadow-2xl p-6 transition-transform transform translate-x-0 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-black dark:text-white">Filtros</h3>
              <CustomClose
                onClick={() => setIsOpen(false)}
              />
            </div>

            <Separator />

            <div className="mt-6 flex-1">
              <h3 className="font-semibold text-black dark:text-white/80 mb-4">Filtrar Por Tipo</h3>
              <FilterContent />
            </div>

            <CustomButton
              onClick={() => setIsOpen(false)}
              className="mt-8 w-full bg-black dark:bg-white/80 hover:bg-white/80 dark:hover:bg-black/80 text-white hover:text-black dark:hover:text-white dark:text-black dark:hover:border-white dark:hover:border-2 font-black hover:scale-105 transition-all duration-300"
              size="lg"
            >
              Ver Resultados
            </CustomButton>
          </div>
        </div>
      )}

      {/* Vista Desktop (Sidebar estático) */}
      <div className="hidden lg:block bg-white/10 dark:bg-black/20 backdrop-blur-xl p-6 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm h-fit col-span-2 lg:col-span-1 border-t-4 border-t-black dark:border-t-rose-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-black dark:text-white/80">Filtros</h3>
          <CustomDeleteButton
            onClick={() => setSelectedBrands([])}
            title="Limpiar filtros"
            aria-label="Limpiar filtros"
            centerIcon={MdOutlineFilterListOff}
            iconSize={22}
            disabled={selectedBrands.length === 0}
            className="w-8 h-8 min-w-[2rem] p-0"
          />
        </div>

        <Separator />

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="font-semibold text-black dark:text-white/80 mb-3">Marcas</h3>
            <FilterContent />
          </div>
        </div>
      </div>
    </>
  );
};
