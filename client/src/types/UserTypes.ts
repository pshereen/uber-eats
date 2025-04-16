interface BaseUser {
    _id: string;
    name: string;
    email: string;
    location?: string;
  }
  
  export interface RestaurantUser extends BaseUser {
    image?: string;
    role: 'restaurant';
  }
  
  export interface CustomerUser extends BaseUser {
    role: 'customer';
  }
  