import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Drink } from '../models';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class DrinkService {
  private readonly baseUrl = API_ENDPOINTS.drinks;

  constructor(private readonly http: HttpClient) {}

  getDrinks(): Observable<Drink[]> {
    return this.http.get<Drink[]>(this.baseUrl);
  }

  createDrink(payload: { name: string; price: number }): Observable<Drink> {
    return this.http.post<Drink>(this.baseUrl, payload);
  }

  updateDrink(drinkId: number, payload: { name: string; price: number }): Observable<Drink> {
    return this.http.put<Drink>(`${this.baseUrl}/${drinkId}`, payload);
  }

  deleteDrink(drinkId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${drinkId}`);
  }
}
