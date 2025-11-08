import { prepareProducts } from "@/helpers";
import { allCelulares } from "@/data/initialData";
import { CardProduct } from "@/Components/products/CardProduct";
import { ContainerFilter } from "@/Components/products/ContainerFilter";

export const TiendaPage = () => {
  const preparedProducts = prepareProducts(allCelulares);

  return (
    <>
      <h1 className="text-5xl font-semibold text-center mb-12">
        Nuestros Productos
      </h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* FILTROS*/}
        <ContainerFilter />
        <div className="col-span-2 lg:col-sapn-2 xl:col-span-4 flex flex-col gap-12">
          <div className="grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4">
            {preparedProducts.map((product) => (
              <CardProduct
                key={product.id}
                img={product.images[0]}
                name={product.name}
                price={product.price}
                slug={product.slug}
                variants={product.variants}
              />
            ))}
          </div>

          {/* PAGINACIÓN */}
        </div>
      </div>
    </>
  );
};
