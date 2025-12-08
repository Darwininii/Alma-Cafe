import type { OrderInput } from "@/interfaces";
import { supabase } from "../supabase/client";

/*   CREAR ORDEN DE COMPRA       */

export const createOrder = async (order: OrderInput) => {
  // 1. Obtener el usuario autenticado + Cliente de tabla customer
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
    })
    .select()
    .single();

  if (orderError) {
    console.log(orderError);
    throw new Error(orderError.message);
  }

  // 5. Guardar los detalles de la orden
  const orderItems = order.cartItems.map((item) => ({
    order_id: orderData.id,
    products_id: item.productId,  // Corregido: products_id en lugar de variant_id
    cantidad: item.quantity,       // Corregido: cantidad en lugar de quantity
    price: item.price,
  }));

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
      `*,  address(*), customers(full_name, email), order_item(quantity, price, products(name, image))`
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
      addressLine: order.address?.address_line,
      city: order.address?.city,
      state: order.address?.state,
      postalCode: order.address?.postal_code,
      country: order.address?.country,
    },
    orderItems: order.order_item.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      productName: item.productos?.name,
      productImage: item.productos?.image,
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
      addressLine: order.address?.address_line,
      city: order.address?.city,
      state: order.address?.state,
      postalCode: order.address?.postal_code,
      country: order.address?.country,
    },
    orderItems: order.order_item.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      productName: item.products?.name,
      productImage: item.products?.image,
    })),
  };
};
