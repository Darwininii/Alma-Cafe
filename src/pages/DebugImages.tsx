import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

interface Product {
    id: string;
    name: string;
    images: string[];
}

interface ImageStatus {
    url: string;
    status: number;
    contentType: string | null;
    error?: string;
}

export const DebugImages = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [imageStatuses, setImageStatuses] = useState<Record<string, ImageStatus>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from("productos")
                .select("id, name, images")
                .order("created_at", { ascending: false })
                .limit(10);

            if (error) {
                console.error("Error fetching products:", error);
            } else {
                setProducts(data || []);
                checkImages(data || []);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const checkImages = async (products: Product[]) => {
        const statuses: Record<string, ImageStatus> = {};

        for (const product of products) {
            for (const imgUrl of product.images) {
                try {
                    const response = await fetch(imgUrl, { method: "HEAD" });
                    statuses[imgUrl] = {
                        url: imgUrl,
                        status: response.status,
                        contentType: response.headers.get("content-type"),
                    };
                } catch (error: any) {
                    statuses[imgUrl] = {
                        url: imgUrl,
                        status: 0,
                        contentType: null,
                        error: error.message,
                    };
                }
            }
        }
        setImageStatuses(statuses);
    };

    if (loading) return <div className="p-10">Cargando diagnóstico...</div>;

    return (
        <div className="p-10 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Diagnóstico de Imágenes</h1>

            {products.length === 0 ? (
                <p>No hay productos para analizar.</p>
            ) : (
                <div className="space-y-8">
                    {products.map((product) => (
                        <div key={product.id} className="border p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                            <p className="text-sm text-gray-500 mb-4">ID: {product.id}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.images.map((img, index) => {
                                    const status = imageStatuses[img];
                                    return (
                                        <div key={index} className="border p-3 rounded bg-gray-50">
                                            <p className="text-xs break-all mb-2 font-mono">{img}</p>

                                            {status ? (
                                                <div className="text-sm space-y-1">
                                                    <p>
                                                        <span className="font-bold">Status:</span>{" "}
                                                        <span className={status.status === 200 ? "text-green-600" : "text-red-600"}>
                                                            {status.status}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span className="font-bold">Content-Type:</span>{" "}
                                                        <span className={status.contentType?.startsWith("image/") ? "text-green-600" : "text-red-600 font-bold"}>
                                                            {status.contentType || "N/A"}
                                                        </span>
                                                    </p>
                                                    {status.error && (
                                                        <p className="text-red-600">Error: {status.error}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400">Verificando...</p>
                                            )}

                                            <div className="mt-3 border-t pt-3">
                                                <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                                                <img
                                                    src={img}
                                                    alt="Preview"
                                                    className="h-32 object-contain bg-white border"
                                                    onError={(e) => (e.currentTarget.style.border = "2px solid red")}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
