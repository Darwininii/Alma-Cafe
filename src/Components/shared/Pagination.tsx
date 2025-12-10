import { TiArrowRightThick, TiArrowLeftThick } from "react-icons/ti";

interface Props {
  totalItems: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination = ({ totalItems, page, setPage }: Props) => {
  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const itemsPerPage = 24;
  const totalPages = totalItems ? Math.ceil(totalItems / itemsPerPage) : 1;

  const isLastPage = page >= totalPages;

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-4 border-t border-gray-100">
      <p className="text-sm text-black">
        Mostrando <span className="font-semibold text-black">{startItem}</span> -{" "}
        <span className="font-semibold text-black">{endItem}</span> de{" "}
        <span className="font-semibold text-black">{totalItems}</span> productos
      </p>

      <div className="flex gap-2">
        <button
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-black hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <TiArrowLeftThick size={16} />
          Anterior
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-black hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700"
          onClick={handleNextPage}
          disabled={isLastPage}
        >
          Siguiente
          <TiArrowRightThick size={16} />
        </button>
      </div>
    </div>
  );
};
