import { Search, Filter } from "lucide-react";
import { CustomInput } from "./CustomInput";
import { CustomButton } from "./CustomButton";
import { Calendar } from "./Calendar";

interface StatusOption {
    value: string;
    label: string;
    variant: string;
}

interface CustomFilteredProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    statusFilter: string[];
    toggleStatusFilter: (status: string) => void;
    dateRange: { start: string; end: string } | null;
    setDateRange: (range: { start: string; end: string } | null) => void;
    handleClearAllFilters: () => void;
    statusOptions: StatusOption[];
    children?: React.ReactNode;
    title?: string;
    showDateFilter?: boolean;
    actions?: React.ReactNode;
}

export const CustomFiltered = ({
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    statusFilter,
    toggleStatusFilter,
    dateRange,
    setDateRange,
    handleClearAllFilters,
    statusOptions,
    children,
    title = "Estado de la orden",
    showDateFilter = true,
    actions
}: CustomFilteredProps) => {
    return (
        <div className="flex flex-col gap-6 mb-8 w-full">
            {/* Search & Filter Toggle Row */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-3 w-full">
                <div className="flex-1">
                    {children}
                </div>
                 <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                        <CustomInput
                            icon={<Search className="h-5 w-5" />}
                            placeholder="Buscar pedido, cliente, total..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            wrapperClassName="h-10 py-0"
                            className="h-full"
                        />
                    </div>
                    <CustomButton 
                        onClick={() => setShowFilters(!showFilters)}
                        variant={showFilters ? "solid" : "outline"}
                        className={`${
                            // 1. If filters are ACTIVE (status != all OR dateRange set OR search term), show GREEN highlight
                            (statusFilter.includes("all") === false || dateRange !== null || searchTerm !== "")
                            ? "bg-green-600 text-white hover:bg-green-700 border-2 border-green-900 dark:bg-green-600 dark:hover:bg-green-700" 
                            // 2. Else, fallback to standard behavior
                            : showFilters 
                                ? "bg-black hover:bg-black/80 hover:text-white dark:bg-slate-700 dark:hover:bg-gray-800 text-white border-2 border-white/20" 
                                : "border-2 border-black/60 dark:border-white/20 dark:text-white/80 hover:bg-black hover:text-white dark:hover:bg-white/80 dark:hover:text-black"
                        }`}
                        leftIcon={Filter} 
                        effect="shine"
                    >
                        Filtros
                    </CustomButton>
                    {actions && (
                        <div className="flex items-center">
                            {actions}
                        </div>
                    )}
                </div>
            </div>

            {/* Advanced Filters Section */}
            {showFilters && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 animate-in slide-in-from-top-2 fade-in duration-200 w-full">
                    <div className="flex flex-col gap-4">
                        {/* Header with Clear All Action */}
                        <div className="flex justify-end">
                            {(statusFilter.includes("all") === false || dateRange !== null) && (
                                <CustomButton 
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleClearAllFilters}
                                    className="text-[10px] font-bold text-red-500 bg-black dark:text-white dark:bg-red-600 
                                    dark:hover:text-black dark:hover:bg-red-300
                                    hover:text-black hover:bg-red-400 uppercase tracking-wide h-auto py-1 px-2"
                                >
                                    Limpiar todos los filtros
                                </CustomButton>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-8 items-center w-full">
                             {/* Status Tabs */}
                            <div className="flex flex-col items-center w-full">
                                <label className="text-xs font-bold text-black/80 dark:text-white/80 uppercase tracking-wider mb-3 block text-center">{title}</label>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <CustomButton
                                        onClick={() => toggleStatusFilter("all")}
                                        size="sm"
                                        className={`rounded-full text-base font-medium h-auto py-2.5 px-6 border transition-all ${
                                            statusFilter.includes("all")
                                            ? "bg-neutral-900 text-white dark:bg-white dark:text-black shadow-lg border-transparent ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-neutral-900 dark:ring-white dark:hover:bg-white/80 hover:bg-black/80" 
                                            : "bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 border-black/40 dark:border-white/10 text-neutral-600 dark:text-neutral-300"
                                        }`}
                                    >
                                        Todos
                                    </CustomButton>
                                    {statusOptions.map(opt => (
                                        <CustomButton
                                            key={opt.value}
                                            onClick={() => toggleStatusFilter(opt.value)}
                                            size="sm"
                                            className={`rounded-full text-base font-medium h-auto py-1.8 px-4 border transition-all ${
                                                statusFilter.includes(opt.value)
                                                ? `ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black border-transparent ${
                                                    opt.variant === 'success' ? 'bg-green-500 hover:bg-green-500/80 text-white dark:text-black ring-green-500' :
                                                    opt.variant === 'warning' ? 'bg-yellow-500 hover:bg-yellow-500/80 text-white dark:text-black ring-yellow-500' :
                                                    opt.variant === 'error' ? 'bg-red-500 hover:bg-red-500/80 text-white dark:text-black ring-red-500' :
                                                    'bg-blue-500 hover:bg-blue-500/80 text-white dark:text-black ring-blue-500'
                                                }`
                                                : "bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 border-black/40 dark:border-white/10 text-neutral-600 dark:text-neutral-300"
                                            }`}
                                        >
                                            {opt.label}
                                        </CustomButton>
                                    ))}
                                </div>
                            </div>

                            {showDateFilter && (
                                <div className="flex flex-col gap-3 items-center w-full">
                                    <div className="flex items-center justify-center w-full">
                                        <label className="text-xs font-bold text-black/80 dark:text-white/80 uppercase tracking-wider block text-center">Fecha</label>
                                    </div>
                                    <div className="w-fit mx-auto">
                                        <Calendar 
                                            value={dateRange}
                                            onChange={setDateRange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
