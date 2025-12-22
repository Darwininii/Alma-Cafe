export interface OrderInput {
  customerId?: string; // FK hacia customers (UUID)
  address: {
    addressLine: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  cartItems: {
    productId: string; // UUID
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  // WOMPI Fields
  reference: string;
  transactionId: string;
  paymentStatus: string;
  paymentMethod: string;
  publicReference?: string;
}

// Representa una orden individual básica (por ejemplo en un historial)
export interface OrderItemSingle {
  created_at: string;
  id: string; // UUID
  status: string;
  total_amount: number;
}

// Orden con información del cliente (JOIN customers)
export interface OrderWithCustomer {
  id: string; // UUID
  status: string;
  total_amount: number;
  created_at: string;
  public_reference?: string;
  customers: {
    full_name: string;
    email: string;
  } | null;
}
