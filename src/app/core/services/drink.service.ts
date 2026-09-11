import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Drink } from '../models';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class DrinkService {
  private readonly baseUrl = API_ENDPOINTS.drinks;
  private readonly http = inject(HttpClient);

  /**
   *   Fetch all drinks from the API.
   * @returns 
   */
  getDrinks(): Observable<Drink[]> {
    return this.http.get<Drink[]>(this.baseUrl);
  }

  /**
   *   Create a drink with the supplied name and price.
   * @param payload 
   * @returns 
   */
  createDrink(payload: { name: string; price: number }): Observable<Drink> {
    return this.http.post<Drink>(this.baseUrl, payload);
  }

  /**
   *   Update an existing drink by its identifier.
   * @param drinkId 
   * @param payload 
   * @returns 
   */
  updateDrink(
    drinkId: number,
    payload: { name: string; price: number },
  ): Observable<Drink> {
    return this.http.put<Drink>(`${this.baseUrl}/${drinkId}`, payload);
  }

  /**
   *   Delete a drink by its identifier.
   * @param drinkId 
   * @returns 
   */
  deleteDrink(drinkId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${drinkId}`);
  }
}
