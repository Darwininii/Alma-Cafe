import type { OrderInput } from "@/interfaces";
import { supabase } from "../supabase/client";

/*   CREAR ORDEN DE COMPRA       */

export const createOrder = async (order: OrderInput) => {
  // 1. Obtener el usuario autenticado y su cliente
  const { data, error: errorUser } = await supabase.auth.getUser();
  if (errorUser) throw new Error(errorUser.message);
  if (!data?.user) throw new Error("No se encontró usuario autenticado.");

  const userId = data.user.id;

  const { data: customer, error: errorCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (errorCustomer) throw new Error(errorCustomer.message);
  const customerId = customer.id;

  // 2. Verificar disponibilidad del producto (stock = "disponible")
  for (const item of order.cartItems) {
    const { data: product, error: productError } = await supabase
      .from("productos")
      .select("stock, name")
      .eq("id", item.productId)
      .single();

    if (productError) throw new Error(productError.message);
    if (!product) throw new Error("Producto no encontrado");

    if (product.stock.toLowerCase() !== "Disponible") {
      throw new Error(
        `El producto "${product.name}" no está disponible actualmente.`
      );
    }
  }

  // 3. Guardar dirección del envío
  const { data: addressData, error: addressError } = await supabase
    .from("address")
    .insert({
      address_line: order.address.addressLine,
      city: order.address.city,
      state: order.address.state,
      postal_code: order.address.postalCode ?? null,
      country: order.address.country,
      customer_id: customerId,
    })
    .select()
    .single();

  if (addressError) throw new Error(addressError.message);

  // 4. Crear la orden
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      address_id: addressData.id,
      total_amount: order.totalAmount,
      status: "Pending",
    })
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  // 5. Insertar los detalles del pedido
  const orderItems = order.cartItems.map((item) => ({
    order_id: orderData.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_item")
    .insert(orderItems);

  if (orderItemsError) throw new Error(orderItemsError.message);

  // 🔹 6. Ya no se modifica el stock (solo se valida disponibilidad)
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

export const getOrderById = async (orderId: number) => {
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
      `*,  addresses(*), customers(full_name, email), order_item(quantity, price, products(name, image))`
    )
    .eq("customer_id", customer.id)
    .eq("id", orderId)
    .single();

  if (error) throw new Error(error.message);

  return {
    customer: {
      email: order?.customers?.email,
      full_name: order?.customers?.full_name,
    },
    totalAmount: order.total_amount,
    status: order.status,
    created_at: order.created_at,
    address: {
      addressLine: order.addresses?.address_line1,
      city: order.addresses?.city,
      state: order.addresses?.state,
      postalCode: order.addresses?.postal_code,
      country: order.addresses?.country,
    },
    orderItems: order.order_item.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      productName: item.products?.name,
      productImage: item.products?.image,
    })),
  };
};

/*      ADMINISTRADOR            */

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("id, total_amount, status, created_at, customers(full_name, email)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
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
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const getOrderByIdAdmin = async (id: number) => {
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      address(*),
      customers(full_name, email),
      order_item(quantity, price, productos(name, image))
    `
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return {
    customer: {
      email: order?.customers?.email,
      full_name: order?.customers?.full_name,
    },
    totalAmount: order.total_amount,
    status: order.status,
    created_at: order.created_at,
    address: {
      addressLine: order.addresses?.address_line1,
      city: order.addresses?.city,
      state: order.addresses?.state,
      postalCode: order.addresses?.postal_code,
      country: order.addresses?.country,
    },
    orderItems: order.order_item.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      productName: item.products?.name,
      productImage: item.products?.image,
    })),
  };
};
