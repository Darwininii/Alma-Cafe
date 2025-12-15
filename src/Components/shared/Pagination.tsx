import { CustomButton } from "./CustomButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  totalItems: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage?: number;
}

export const Pagination = ({ totalItems, page, setPage, itemsPerPage = 12 }: Props) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handleNextPage = () => {
    setPage((p) => Math.min(p + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePrevPage = () => {
    setPage((p) => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  // Smart Pagination Logic (Max 5 buttons)
  const getVisiblePages = () => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(page - 2, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end === totalPages) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 pt-6 border-t border-slate-200 dark:border-white/10">

      {/* Info Section */}
      <div className="flex flex-col gap-1 text-center md:text-left">
        <p className="text-sm font-medium text-black dark:text-slate-400">
          Mostrando <span className="text-black/90 dark:text-white font-bold">{Math.min(startItem, totalItems)}</span> - <span className="text-black/90 dark:text-white font-bold">{endItem}</span>
        </p>
        <p className="text-xs text-black/70 dark:text-slate-500">
          de <span className="font-semibold">{totalItems}</span> productos
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/10 dark:bg-white/10 backdrop-blur-sm border border-black/50 dark:border-white/5 shadow-sm">

        {/* First Page & Prev */}
        <CustomButton
          size="icon"
          effect="magnetic"
          disabled={page === 1}
          onClick={handlePrevPage}
          className={cn(
            "rounded-xl hover:bg-white/60 dark:hover:bg-white/20 hover:text-black dark:hover:text-white",
            page === 1 && "opacity-30"
          )}
          aria-label="Anterior"
          centerIcon={ChevronLeft}
          iconSize={20}
        />

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {visiblePages[0] > 1 && (
            <>
              <CustomButton
                size="sm"
                className="w-9 h-9 min-w-[2.25rem] p-0 font-black text-black dark:text-slate-500 hover:text-primary rounded-xl"
                onClick={() => goToPage(1)}
                effect="none"
              >
                1
              </CustomButton>
              {visiblePages[0] > 2 && <span className="text-black dark:text-slate-300">...</span>}
            </>
          )}

          {visiblePages.map((p) => (
            <CustomButton
              key={p}
              size="sm"
              effect={page === p ? "shine" : "magnetic"}
              effectColor={page === p ? "bg-amber-500/80" : undefined}
              className={cn(
                "w-10 h-10 min-w-[2.5rem] rounded-xl font-bold transition-all p-0",
                page === p
                  ? "bg-black text-white dark:bg-black dark:text-white shadow-lg shadow-amber-500/20 scale-105"
                  : "bg-transparent text-white dark:text-slate-300 hover:bg-black/20 dark:hover:bg-white/10"
              )}
              onClick={() => goToPage(p)}
            >
              {p}
            </CustomButton>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="text-slate-300">...</span>}
              <CustomButton
                size="sm"
                className="w-9 h-9 min-w-[2.25rem] p-0 font-bold text-black dark:text-slate-500 hover:text-primary rounded-xl"
                onClick={() => goToPage(totalPages)}
                effect="none"
              >
                {totalPages}
              </CustomButton>
            </>
          )}
        </div>

        {/* Next & Last Page */}
        <CustomButton
          size="icon"
          effect="magnetic"
          disabled={page === totalPages}
          onClick={handleNextPage}
          className={cn(
            "rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:text-black dark:hover:text-white",
            page === totalPages && "opacity-30"
          )}
          aria-label="Siguiente"
          centerIcon={ChevronRight}
          iconSize={20}
        />
      </div>
    </div>
  );
};
