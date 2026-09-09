import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../constants/api.constants';
import { Order } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private readonly http: HttpClient) {}

  placeOrder(cartId: string): Observable<Order> {
    return this.http.post<Order>(API_ENDPOINTS.orders, { cartId });
  }
}
