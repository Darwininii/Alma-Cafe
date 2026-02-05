import { useState, useMemo } from "react";
import { Icons } from "@/Components/shared/Icons";
import { CustomButton } from "@/Components/shared/CustomButton";

export const IconTestPage = () => {
  const [selectedIcon, setSelectedIcon] = useState<string>("Store");
  const [searchTerm, setSearchTerm] = useState("");
  const [iconSize, setIconSize] = useState<number>(24);

  const options = Object.keys(Icons) as string[];

  const filteredOptions = useMemo(() => {
    return options.filter((icon) =>
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <div className="min-h-screen pt-32 px-4 flex flex-col items-center gap-10 bg-slate-100 dark:bg-slate-900 pb-20">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        CMS Icon Selector
      </h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        
        {/* Panel Izquierdo: Selector */}
        <div className="flex-1 bg-white dark:bg-black/40 p-6 rounded-3xl shadow-xl border border-black/5 dark:border-white/10 flex flex-col gap-6 h-[70vh]">
          
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Biblioteca de Iconos
            </h2>
            
            {/* Buscador */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Buscar (ej. cart, user, moon)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icons.Search size={18} />
              </div>
            </div>

            {/* Size Control */}
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-3 rounded-xl">
               <span className="text-xs font-bold text-slate-500 uppercase">Size: {iconSize}px</span>
               <input 
                 type="range"
                 min="12"
                 max="48"
                 value={iconSize}
                 onChange={(e) => setIconSize(Number(e.target.value))}
                 className="flex-1 accent-rose-500 cursor-pointer"
               />
            </div>
          </div>

          {/* Grid de Iconos */}
          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-8 gap-3 content-start">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((iconKey) => {
                const IconComponent = Icons[iconKey as keyof typeof Icons];
                const isSelected = selectedIcon === iconKey;

                return (
                  <button
                    key={iconKey}
                    onClick={() => setSelectedIcon(iconKey)}
                    className={`
                      aspect-square flex flex-col items-center justify-center gap-2 rounded-xl transition-all
                      border-2 cursor-pointer
                      ${isSelected 
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600 scale-95" 
                        : "border-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"}
                    `}
                    title={iconKey}
                  >
                    <IconComponent size={24} />
                    <span className="text-[10px] font-medium truncate w-full text-center px-1">
                      {iconKey}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full h-40 flex flex-col items-center justify-center text-slate-400">
                <p>No se encontraron iconos</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho: Previsualización */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          <div className="bg-white dark:bg-black/40 p-6 rounded-3xl shadow-xl border border-black/5 dark:border-white/10 sticky top-32">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
              Resultado en Vivo
            </h2>
            
            <div className="flex flex-col items-center gap-6 p-6 bg-slate-100 dark:bg-black/60 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
              <CustomButton
                size="lg"
                className="w-full shadow-lg"
                effect="shine"
                leftIcon={selectedIcon}
                iconSize={iconSize} // Passing dynamic size likely needs verify if CustomButton supports it. 
                // Checking previous code: button accepts iconSize prop.
              >
                Botón Dinámico
              </CustomButton>

              <div className="w-full h-px bg-slate-300 dark:bg-white/10" />

              <div className="text-center space-y-2">
                 <p className="text-xs font-mono text-slate-500 break-all bg-slate-200 dark:bg-black/80 p-2 rounded">
                    icon: "{selectedIcon}"
                 </p>
                 <p className="text-xs font-mono text-slate-500 break-all bg-slate-200 dark:bg-black/80 p-2 rounded">
                    size: {iconSize}
                 </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
