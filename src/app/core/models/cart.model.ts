import { Drink } from './drink.model';
import { Topping } from './topping.model';

export interface CartItem {
  id: string;
  drinkId: number;
  drink: Drink;
  toppings: Topping[];
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  promotionName: string | null;
  discountAmount: number;
  total: number;
}

export interface CartResponse {
  id: string;
  items: CartItem[];
  summary: CartSummary;
}
