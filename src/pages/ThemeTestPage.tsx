import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { CustomButton } from "@/Components/shared/CustomButton";
import { Icons } from "@/Components/shared/Icons";
import { useThemeStore } from "@/store/theme.store";
import type { Direction, GradientType } from "@/store/theme.store";

export const ThemeTestPage = () => {
  // Conectar con Store Global
  const { 
    colors: globalColors, 
    type: globalType, 
    direction: globalDirection, 
    saveTheme 
  } = useThemeStore();
  
  // Estado local para edición ("Draft")
  const [localColors, setLocalColors] = useState<string[]>([]);
  const [localType, setLocalType] = useState<GradientType>("radial");
  const [localDirection, setLocalDirection] = useState<Direction>("center");

  // Al montar, sincronizar estado local con global
  useEffect(() => {
    setLocalColors(globalColors);
    setLocalType(globalType);
    setLocalDirection(globalDirection);
  }, [globalColors, globalType, globalDirection]);

  // Estado local para el picker UI
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);

  // Manejo de Colores Locales
  const addColor = () => {
    setLocalColors([...localColors, "#ffffff"]);
  };

  const removeColor = (indexToRemove: number) => {
    if (localColors.length <= 1) return;
    setLocalColors(localColors.filter((_, index) => index !== indexToRemove));
    if (activeColorIndex === indexToRemove) setActiveColorIndex(null);
  };

  const updateColor = (index: number, newColor: string) => {
    const newColors = [...localColors];
    newColors[index] = newColor;
    setLocalColors(newColors);
  };

  // Generador de gradiente CSS (Local para Preview)
  const generatePreviewGradient = () => {
    const colorString = localColors.map((color, index) => {
      const percentage = localColors.length === 1 ? 100 : Math.round((index / (localColors.length - 1)) * 100);
      return `${color} ${percentage}%`;
    }).join(", ");

    if (localType === "radial") {
      let position = "50% 50%";
      if (localDirection === "top") position = "50% 10%";
      if (localDirection === "bottom") position = "50% 90%";
      if (localDirection === "left") position = "10% 50%";
      if (localDirection === "right") position = "90% 50%";
      if (localDirection === "center") position = "50% 50%";

      return `radial-gradient(125% 125% at ${position}, ${colorString})`;
    } else {
      let deg = "180deg"; 
      if (localDirection === "top") deg = "0deg";
      if (localDirection === "right") deg = "90deg";
      if (localDirection === "bottom") deg = "180deg";
      if (localDirection === "left") deg = "270deg";
      
      return `linear-gradient(${deg}, ${colorString})`;
    }
  };

  const previewGradient = generatePreviewGradient();

  // Guardar cambios en el store global
  const applyChanges = async () => {
    const success = await saveTheme({
       colors: localColors,
       type: localType,
       direction: localDirection
    });
    
    if (success) {
      toast.success("Tema guardado exitosamente");
    } else {
      toast.error("Error al guardar el tema");
    }
  };

  // Resetear a valores globales
  const resetChanges = () => {
    setLocalColors(globalColors);
    setLocalType(globalType);
    setLocalDirection(globalDirection);
  };

  return (
    <div className="min-h-screen pt-32 px-4 flex flex-col items-center gap-10 bg-slate-100 dark:bg-slate-900 pb-20">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Theme Engine POC
        </h1>
        <p className="text-slate-500 text-sm">Prueba tu diseño localmente y aplica para ver el cambio global.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        
        {/* Panel de Configuración */}
        <div className="flex-1 bg-white dark:bg-black/40 p-8 rounded-3xl shadow-xl border border-black/5 dark:border-white/10 flex flex-col gap-8">
          
          {/* 1. Colores */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><Icons.Search size={16} /> Paleta de Colores ({localColors.length})</span>
            </h2>
            
            <div className="flex flex-wrap gap-4 justify-center py-6 bg-slate-50 dark:bg-white/5 rounded-xl min-h-[120px] items-start relative">
              {localColors.map((color, index) => (
                <div key={index} className="flex flex-col items-center gap-2 group relative">
                  <button
                    onClick={() => setActiveColorIndex(activeColorIndex === index ? null : index)}
                    className={`w-14 h-14 rounded-full shadow-lg border-4 transition-transform hover:scale-110 ${activeColorIndex === index ? "border-rose-500 scale-110" : "border-white dark:border-white/20"}`}
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex items-center gap-1">
                     <span className="text-[10px] font-mono text-slate-500 uppercase">{color}</span>
                     {localColors.length > 1 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeColor(index); }}
                          className="text-red-400 hover:text-red-600 p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          title="Eliminar color"
                        >
                          <Icons.Delete size={12} />
                        </button>
                     )}
                  </div>
                  
                  {/* Picker Flotante */}
                  {activeColorIndex === index && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20">
                      <div 
                        className="fixed inset-0" 
                        onClick={() => setActiveColorIndex(null)} 
                      />
                      <div className="relative bg-white p-3 rounded-xl shadow-2xl border border-black/10 flex flex-col gap-3">
                        <HexColorPicker color={color} onChange={(val) => updateColor(index, val)} />
                        
                        {/* Hex Input */}
                        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-2 py-1">
                          <span className="text-slate-400 text-xs">#</span>
                          <HexColorInput 
                            color={color} 
                            onChange={(val) => updateColor(index, val)}
                            prefixed={false}
                            className="bg-transparent text-sm w-full font-mono outline-none text-slate-700 uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add Button */}
              {localColors.length < 5 && (
                <button
                  onClick={addColor}
                  className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
                  title="Añadir color"
                >
                  <Icons.ShoppingLucide size={20} className="rotate-45" /> 
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-black/10 dark:bg-white/10 w-full" />

          {/* 2. Tipo de Gradiente */}
          <div className="space-y-4">
             <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Estilo de Fondo
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setLocalType("radial")}
                className={`p-4 rounded-xl border-2 transition-all font-bold ${localType === "radial" ? "border-rose-500 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-500"}`}
              >
                Radial (Circular)
              </button>
              <button
                 onClick={() => setLocalType("linear")}
                 className={`p-4 rounded-xl border-2 transition-all font-bold ${localType === "linear" ? "border-rose-500 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-500"}`}
              >
                Linear (Recto)
              </button>
            </div>
          </div>

          {/* 3. Dirección */}
          <div className="space-y-4">
             <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Dirección / Posición
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {(["top", "bottom", "left", "right", "center"] as Direction[]).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setLocalDirection(dir)}
                  className={`p-2 rounded-lg border text-xs font-bold uppercase ${localDirection === dir ? "bg-black text-white dark:bg-white dark:text-black border-transparent" : "border-slate-200 text-slate-400"}`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Acciones */}
          <div className="flex gap-4 pt-4">
             <CustomButton
               onClick={resetChanges}
               variant="outline"
               className="flex-1"
             >
               Cancelar
             </CustomButton>
             <CustomButton
               onClick={applyChanges}
               className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
               effect="shine"
             >
               Aplicar Cambio Global
             </CustomButton>
          </div>

        </div>

        {/* Panel Derecho: Previsualización */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div className="bg-white dark:bg-black/40 p-6 rounded-3xl shadow-xl border border-black/5 dark:border-white/10 sticky top-32">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
              Preview (Local)
            </h2>
            
            {/* Box simulando el body */}
            <div 
              className="w-full aspect-9/16 rounded-2xl shadow-inner border border-black/5 transition-all duration-500 relative overflow-hidden"
              style={{ backgroundImage: previewGradient }}
            >
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 text-white font-bold shadow-lg">
                    Contenido
                 </div>
               </div>
            </div>

            <div className="mt-6 space-y-2">
               <p className="text-xs font-mono text-slate-500 break-all bg-slate-100 dark:bg-black/80 p-3 rounded-lg border border-slate-200 dark:border-white/10">
                  {previewGradient}
               </p>
               <CustomButton 
                 className="w-full" 
                 size="sm"
                 variant="outline"
                 onClick={() => navigator.clipboard.writeText(previewGradient)}
               >
                 Copiar Link CSS
               </CustomButton>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
