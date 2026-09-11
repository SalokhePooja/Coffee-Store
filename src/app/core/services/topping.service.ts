import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Topping } from '../models';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class ToppingService {
  private readonly baseUrl = API_ENDPOINTS.toppings;

  private readonly http = inject(HttpClient);

  /**
   * Fetch all available toppings from the API.
   * @returns 
   */
  getToppings(): Observable<Topping[]> {
    return this.http.get<Topping[]>(this.baseUrl);
  }

  /**
   * Create a topping with the supplied name and price.
   * @param payload 
   * @returns 
   */
  createTopping(payload: { name: string; price: number }): Observable<Topping> {
    return this.http.post<Topping>(this.baseUrl, payload);
  }

  /**
   * Update an existing topping by its identifier.
   * @param toppingId 
   * @param payload 
   * @returns 
   */
  updateTopping(
    toppingId: number,
    payload: { name: string; price: number },
  ): Observable<Topping> {
    return this.http.put<Topping>(`${this.baseUrl}/${toppingId}`, payload);
  }

  /**
   * Delete a topping by its identifier.
   * @param toppingId 
   * @returns 
   */
  deleteTopping(toppingId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.baseUrl}/${toppingId}`,
    );
  }
}
