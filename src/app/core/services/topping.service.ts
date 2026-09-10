import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Topping } from '../models';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class ToppingService {
  private readonly baseUrl = API_ENDPOINTS.toppings;

  private readonly http = inject(HttpClient);

  getToppings(): Observable<Topping[]> {
    return this.http.get<Topping[]>(this.baseUrl);
  }

  createTopping(payload: { name: string; price: number }): Observable<Topping> {
    return this.http.post<Topping>(this.baseUrl, payload);
  }

  updateTopping(
    toppingId: number,
    payload: { name: string; price: number },
  ): Observable<Topping> {
    return this.http.put<Topping>(`${this.baseUrl}/${toppingId}`, payload);
  }

  deleteTopping(toppingId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.baseUrl}/${toppingId}`,
    );
  }
}
