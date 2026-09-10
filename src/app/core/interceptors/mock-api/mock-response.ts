import {
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { CartItem, CartResponse, CartSummary, Topping } from '../../models';
import { calculateCartSummary } from '../../utils/promotion.util';
import { MockCart } from './mock-types';

export function response<T>(
  status: number,
  body: T,
): Observable<HttpResponse<T>> {
  return of(new HttpResponse({ status, body }));
}

export function error(status: number, message: string): Observable<never> {
  return throwError(
    () => new HttpErrorResponse({ status, error: { message } }),
  );
}

export function buildSummary(items: CartItem[]): CartSummary {
  return calculateCartSummary(items);
}

export function cartResponse(cart: MockCart): CartResponse {
  return { id: cart.id, items: cart.items, summary: buildSummary(cart.items) };
}

export function toppingSignature(toppings: Topping[]): string {
  return toppings
    .map((topping) => topping.id)
    .sort((first, second) => first - second)
    .join(',');
}
