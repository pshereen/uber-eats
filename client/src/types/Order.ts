export type OrderItemPayload = {
    menuItemId: string;
    title: string;
    price: number;
    quantity: number;
    restaurant: {
      _id: string;
      name: string;
    };
    image?: string;
  };
  
  export type OrderPayload = {
    userId: string | null;
    items: OrderItemPayload[];
    total: number;
    guestInfo?: {
      name: string;
      email: string;
      address: string;
    };
  };
  