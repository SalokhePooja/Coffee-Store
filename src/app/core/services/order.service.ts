import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../constants/api.constants';
import { Order } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  
  /**
   * Submit an order for the specified cart.
   * @param cartId 
   * @returns 
   */
  placeOrder(cartId: string): Observable<Order> {
    return this.http.post<Order>(API_ENDPOINTS.orders, { cartId });
  }
}
