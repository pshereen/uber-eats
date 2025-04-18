export interface MenuItem {
    _id: string;
    title: string;
    description: string;
    price: number;
    image?: string;
    restaurant: string;
  }
  
  export type NewMenuItem = Omit<MenuItem, '_id' | 'restaurant'>;
  