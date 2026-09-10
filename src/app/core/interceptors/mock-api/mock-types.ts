import {
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { CartItem, Drink, Order, Topping } from '../../models';

export interface MockCart {
  id: string;
  items: CartItem[];
}

export interface MockDatabase {
  drinks: Drink[];
  toppings: Topping[];
  carts: MockCart[];
  orders: Order[];
}

export interface AddCartItemRequest {
  drinkId: number;
  toppings: number[];
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CreateOrderRequest {
  cartId?: string;
}

export type MockHandlerResult = Observable<HttpEvent<unknown>> | undefined;
