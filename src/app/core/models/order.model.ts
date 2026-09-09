import { CartItem } from './cart.model';

export interface Order {
  id: string;
  total: number;
  subtotal: number;
  discountAmount: number;
  promotionName: string | null;
  createdAt: string;
  items: CartItem[];
}
