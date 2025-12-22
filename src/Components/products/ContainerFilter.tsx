import { useState } from "react";
import { Separator } from "../shared/Separator";
import { CustomButton } from "../shared/CustomButton";
import { MdOutlineFilterList, MdOutlineFilterListOff } from "react-icons/md";
import { CustomDeleteButton } from "../shared/CustomDeleteButton";
import { CustomClose } from "../shared/CustomClose";
import { CustomInput } from "../shared/CustomInput";
import { FaSearch } from "react-icons/fa";
import { useBrands } from "@/hooks";
import { CustomCheckbox } from "../shared/CustomCheckbox";


interface Props {
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ContainerFilter = ({
  selectedBrands,
  setSelectedBrands,
  searchTerm,
  setSearchTerm,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { brands } = useBrands();

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-3">
      {/* Si hay marcas cargadas, las mostramos. Si no, o está cargando, no se muestra nada o un loader si quisieras */}
      {brands?.map((brand) => (
        <CustomCheckbox
          key={brand.id}
          id={`brand-${brand.id}`}
          checked={selectedBrands.includes(brand.name)}
          onChange={() => handleBrandChange(brand.name)}
          label={brand.name}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Botón y Search para Móvil */}
      <div className="col-span-2 lg:hidden flex gap-2 items-center h-10">
        <CustomButton
          onClick={() => setIsOpen(true)}
          className="bg-black dark:bg-white/80 text-white dark:text-black shrink-0"
          size="icon"
          title="Filtrar Productos"
          effect="shine"
        >
          <MdOutlineFilterList size={22} />
        </CustomButton>

        {/* Search Input Movil */}
        <CustomInput
          type="text"
          placeholder="¿Qué buscas?"
          label="Buscar Producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<FaSearch size={16} className="text-black/50 dark:text-white/50" />}
          containerClassName="flex-1"
          wrapperClassName="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 h-10"
          className="text-black dark:text-white text-sm"
        />

        <CustomDeleteButton
          onClick={() => {
            setSelectedBrands([]);
            setSearchTerm("");
          }}
          title="Limpiar filtros"
          aria-label="Limpiar filtros"
          centerIcon={MdOutlineFilterListOff}
          className="shrink-0 h-10 w-10"
          disabled={selectedBrands.length === 0 && !searchTerm}
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
            onClick={() => {
              setSelectedBrands([]);
              setSearchTerm("");
            }}
            title="Limpiar filtros"
            aria-label="Limpiar filtros"
            centerIcon={MdOutlineFilterListOff}
            iconSize={22}
            disabled={selectedBrands.length === 0 && !searchTerm}
            className="w-8 h-8 min-w-[2rem] p-0"
          />
        </div>

        <Separator />

        <div className="mt-5 space-y-5">
          {/* Search Desktop */}
          <div>
            <CustomInput
              type="text"
              placeholder="¿Qué buscas?"
              label="Buscar Producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<FaSearch size={16} className="text-black/50 dark:text-white/50" />}
              containerClassName="w-full"
              wrapperClassName="bg-white/5 dark:bg-white/5 border-none h-10"
              className="text-sm"
            />
          </div>
          <div>
            <h3 className="font-semibold text-black dark:text-white/80 mb-3">Marcas</h3>
            <FilterContent />
          </div>
        </div>
      </div>
    </>
  );
};
