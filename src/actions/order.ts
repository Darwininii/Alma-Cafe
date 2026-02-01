import type { OrderInput } from "@/interfaces";
import { supabase } from "../supabase/client";

/*   CREAR ORDEN DE COMPRA       */

export const createOrder = async (order: OrderInput) => {
  // 1. Obtener el usuario autenticado
  const { data, error: errorUser } = await supabase.auth.getUser();

  if (errorUser) {
    console.log(errorUser);
    throw new Error(errorUser.message);
  }

  const userId = data.user.id;
  const userEmail = data.user.email;

  // 2. Buscar o crear el customer
  let { data: customer, error: errorCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (errorCustomer) {
    console.log(errorCustomer);
    throw new Error(errorCustomer.message);
  }

  // Si no existe el customer, crearlo
  if (!customer) {
    const { data: newCustomer, error: createCustomerError } = await supabase
      .from("customers")
      .insert({
        user_id: userId,
        email: userEmail || "",
        full_name: userEmail?.split("@")[0] || "Usuario",
        phone: "",
      })
      .select("id")
      .single();

    if (createCustomerError) {
      console.log(createCustomerError);
      throw new Error("Error al crear el perfil de cliente");
    }

    customer = newCustomer;
  }

  const customerId = customer.id;

  // 3. Guardar la dirección del envío
  const { data: addressData, error: addressError } = await supabase
    .from("address")
    .insert({
      address_line: order.address.addressLine || `${order.address.city}, ${order.address.state}`,
      city: order.address.city,
      state: order.address.state,
      postal_code: order.address.postalCode,
      country: order.address.country,
      customer_id: customerId,
    })
    .select()
    .single();

  if (addressError) {
    console.log(addressError);
    throw new Error(addressError.message);
  }

  // 4. Crear la orden
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      address_id: addressData.id,
      total_amount: order.totalAmount,
      status: "Pending",
      // WOMPI Fields
      reference: order.reference,
      transaction_id: order.transactionId,
      payment_status: order.paymentStatus || "PENDING",
      payment_method: order.paymentMethod
    })
    .select()
    .single();

  if (orderError) {
    console.log(orderError);
    throw new Error(orderError.message);
  }

  // 5. Preparar y guardar los detalles de la orden con snapshot

  // Obtener IDs de productos para buscar su info actual
  const productIds = order.cartItems.map((item) => item.productId);
  const { data: productsInfo, error: productsError } = await supabase
    .from("productos")
    .select("id, name, images, price, slug")
    .in("id", productIds);

  if (productsError) {
    console.log("Error fetching products for snapshot", productsError);
    // No bloqueamos la orden si falla esto, pero es ideal tenerlo.
    // O podemos lanzar error si es crítico. Lanzaremos error para seguridad de datos.
    throw new Error("Error al validar productos para la orden");
  }

  const orderItems = order.cartItems.map((item) => {
    const productData = productsInfo?.find(p => p.id === item.productId);

    return {
      order_id: orderData.id,
      products_id: item.productId,
      cantidad: item.quantity,
      price: item.price,
      // Guardamos la snapshot del producto en ese momento
      product_snapshot: productData ? {
        name: productData.name,
        image: productData.images?.[0] || null,
        slug: productData.slug
      } : null
    };
  });

  const { error: orderItemsError } = await supabase
    .from("orders_item")
    .insert(orderItems);

  if (orderItemsError) {
    console.log(orderItemsError);
    throw new Error(orderItemsError.message);
  }

  // Retornar la orden creada
  return orderData;
};

/*   OBTENER ORDENES CLIENTE     */

export const getOrdersByCustomerId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  if (!data?.user) throw new Error("No se encontró usuario autenticado.");

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", data.user.id)
    .single();

  if (customerError) throw new Error(customerError.message);

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, total_amount, status, created_at")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });

  if (ordersError) throw new Error(ordersError.message);
  return orders;
};

/*   OBTENER ORDEN POR ID        */

export const getOrderById = async (orderId: string) => {
  const { data: user, error: errorUser } = await supabase.auth.getUser();
  if (errorUser) throw new Error(errorUser.message);
  if (!user?.user) throw new Error("No se encontró usuario autenticado.");

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", user.user.id)
    .single();

  if (customerError) throw new Error(customerError.message);

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `*,  address(*), customers(full_name, email, phone), orders_item(cantidad, price, product_snapshot, productos!left(name, images))`
    )
    .eq("customer_id", customer.id)
    .eq("id", Number(orderId))
    .single();

  if (error) throw new Error(error.message);

  return {
    id: order.id,
    customer: {
      email: order?.customers?.email,
      full_name: order?.customers?.full_name,
      phone: order?.customers?.phone,
    },
    totalAmount: order.total_amount,
    status: order.status,
    created_at: order.created_at,
    // WOMPI DATA
    reference: order.reference,
    transactionId: order.transaction_id,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    currency: order.currency,
    address: {
      addressLine: order.address?.address_line,
      city: order.address?.city,
      state: order.address?.state,
      postalCode: order.address?.postal_code,
      country: order.address?.country,
    },
    orderItems: order.orders_item.map((item: any) => ({
      quantity: item.cantidad,
      price: item.price,
      productName: item.productos?.name ?? item.product_snapshot?.name ?? "Producto Eliminado",
      productImage: item.productos?.images ?? (item.product_snapshot?.image ? [item.product_snapshot?.image] : null),
    })),
  };
};

/*      ADMINISTRADOR            */

export const getAllOrders = async ({
  page,
  searchTerm = "",
}: {
  page?: number;
  searchTerm?: string;
} = {}) => {
  const itemsPerPage = 10;
  
  let query = supabase
    .from("orders")
    .select(
      "id, total_amount, status, created_at, customers!inner(full_name, email, phone), address(address_line, city, state, postal_code, country)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (searchTerm) {
    if (!isNaN(Number(searchTerm))) {
         // Numeric -> Search Order ID
         query = query.eq('id', Number(searchTerm));
    } else {
         // Text -> Search Customer fields
         query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`, { foreignTable: 'customers' });
    }
  }

  // Si se pasa pagina, paginamos. Si no, devolvemos todo.
  if (page) {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) throw new Error(error.message);
    return { data, count };
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  
  return {
    data,
    count
  };
};

export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", Number(id));

  if (error) throw new Error(error.message);
};

export const getOrderByIdAdmin = async (id: string) => {
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      address(*),
      customers(full_name, email, phone),
      orders_item(cantidad, price, product_snapshot, productos!left(name, images))
    `
    )
    .eq("id", Number(id))
    .single();

  if (error) throw new Error(error.message);

  return {
    id: order.id,
    customer: {
      email: order?.customers?.email,
      full_name: order?.customers?.full_name,
      phone: order?.customers?.phone,
    },
    totalAmount: order.total_amount,
    status: order.status,
    created_at: order.created_at,
    // WOMPI DATA
    reference: order.reference,
    transactionId: order.transaction_id,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    currency: order.currency,
    address: {
      addressLine: order.address?.address_line,
      city: order.address?.city,
      state: order.address?.state,
      postalCode: order.address?.postal_code,
      country: order.address?.country,
    },
    orderItems: order.orders_item.map((item: any) => ({
      quantity: item.cantidad,
      price: item.price,
      productName: item.productos?.name ?? item.product_snapshot?.name ?? "Producto Eliminado",
      productImage: item.productos?.images ?? (item.product_snapshot?.image ? [item.product_snapshot?.image] : null),
    })),
  };
};
