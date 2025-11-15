export interface OrderInput {
  customerId: number; // FK hacia customers
  address: {
    addressLine: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  cartItems: {
    productId: number; // relación con products
    quantity: number;
    price: number; // precio unitario o total (según tu lógica)
  }[];
  totalAmount: number;
}

// Representa una orden individual básica (por ejemplo en un historial)
export interface OrderItemSingle {
  created_at: string;
  id: number;
  status: string;
  total_amount: number;
}

// Orden con información del cliente (JOIN customers)
export interface OrderWithCustomer {
  id: number;
  status: string;
  total_amount: number;
  created_at: string;
  customers: {
    full_name: string;
    email: string;
  } | null;
}
