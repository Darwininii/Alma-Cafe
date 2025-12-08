// Componente de prueba para verificar las URLs de imágenes
// Crea este archivo temporalmente para diagnosticar el problema

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';

export const ImageDebugger = () => {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) {
                console.error('Error fetching products:', error);
                return;
            }

            console.log('=== PRODUCTOS OBTENIDOS ===');
            data?.forEach((product, index) => {
                console.log(`\nProducto ${index + 1}: ${product.name}`);
                console.log('ID:', product.id);
                console.log('Images array:', product.images);
                console.log('Images length:', product.images?.length || 0);

                if (product.images && product.images.length > 0) {
                    product.images.forEach((url: string, i: number) => {
                        console.log(`  Imagen ${i + 1}:`, url);
                    });
                } else {
                    console.log('  ⚠️ No tiene imágenes');
                }
            });

            setProducts(data || []);
        };

        fetchProducts();
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
            <h2>Image Debugger</h2>
            {products.map((product) => (
                <div key={product.id} style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'white' }}>
                    <h3>{product.name}</h3>
                    <p><strong>ID:</strong> {product.id}</p>
                    <p><strong>Images array:</strong> {JSON.stringify(product.images)}</p>

                    {product.images && product.images.length > 0 ? (
                        <div>
                            <p><strong>Primera imagen:</strong></p>
                            <p style={{ wordBreak: 'break-all', fontSize: '12px' }}>{product.images[0]}</p>
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    objectFit: 'contain',
                                    border: '2px solid red',
                                    backgroundColor: '#f9f9f9'
                                }}
                                onLoad={() => console.log('✅ Imagen cargó:', product.name)}
                                onError={(e) => {
                                    console.error('❌ Error cargando imagen:', product.name);
                                    console.error('URL:', product.images[0]);
                                    console.error('Error event:', e);
                                }}
                            />
                        </div>
                    ) : (
                        <p style={{ color: 'red' }}>⚠️ No hay imágenes</p>
                    )}
                </div>
            ))}
        </div>
    );
};
