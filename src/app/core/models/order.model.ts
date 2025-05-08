import { CartItem } from './cart.model';

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
}