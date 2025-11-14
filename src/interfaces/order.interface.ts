// Entrada de una nueva orden
export interface OrderInput {
  customerId: number; // FK hacia customers
  address: {
    addressLine1: string;
    addressLine2?: string;
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
  id: number;
  customer_id: number;
  address_id: number;
  status: string;
  total_amount: number;
  created_at: string;
}

// Orden con información del cliente (JOIN customers)
export interface OrderWithCustomer {
  id: number;
  status: string;
  total_amount: number;
  created_at: string;
  customer: {
    full_name: string;
    email: string;
  } | null;
}
