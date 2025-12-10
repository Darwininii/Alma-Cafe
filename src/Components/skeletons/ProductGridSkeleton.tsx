interface Props {
  numberOfProducts: number;
}

export const ProductGridSkeleton = ({ numberOfProducts }: Props) => {
  return (
    <div className="my-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8 animate-pulse">
        {Array.from({ length: numberOfProducts }).map((_, index) => (
          <div
            key={index}
            className="relative max-w-sm bg-white rounded-xl shadow-md overflow-hidden"
          >
            {/* Imagen placeholder */}
            <div className="h-64 w-full bg-gray-200" />

            {/* Contenido placeholder */}
            <div className="p-4 flex flex-col items-center">
              {/* Título */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />

              {/* Precio */}
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />

              {/* Botones */}
              <div className="flex gap-3 w-full justify-center">
                <div className="h-10 w-12 bg-gray-200 rounded-full" />
                <div className="h-10 w-24 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
