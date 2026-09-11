import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CartResponse } from '../models';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly cartId = 'cart-1';
  private readonly baseUrl = API_ENDPOINTS.cart;
  private readonly http = inject(HttpClient);

  /**
   *   Load the current cart from the API.
   */
  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}/${this.cartId}`);
  }

  /**
   *   Add a drink and its toppings to the cart.
   * @param payload 
   * @returns 
   */
  addCartItem(payload: { drinkId: number; toppings: number[]; quantity?: number }): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.baseUrl}/${this.cartId}/items`, payload);
  }

  /**
   *   Change the quantity of an item in the cart.
   * @param itemId 
   * @param quantity 
   * @returns 
   */
  updateCartItem(itemId: string, quantity: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.baseUrl}/${this.cartId}/items/${itemId}`, { quantity });
  }

  /**
   *   Remove an item from the cart.
   * @param itemId 
   * @returns 
   */
  deleteCartItem(itemId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.baseUrl}/${this.cartId}/items/${itemId}`);
  }

}
