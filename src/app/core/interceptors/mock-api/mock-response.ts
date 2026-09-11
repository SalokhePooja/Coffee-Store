import {
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { CartItem, CartResponse, CartSummary, Topping } from '../../models';
import { calculateCartSummary } from '../../utils/promotion.util';
import { MockCart } from './mock-types';

// Wraps a mock API payload in an Angular HTTP response observable.
export function response<T>(
  status: number,
  body: T,
): Observable<HttpResponse<T>> {
  return of(new HttpResponse({ status, body }));
}

// Builds a mocked HTTP error observable with a message payload.
export function error(status: number, message: string): Observable<never> {
  return throwError(
    () => new HttpErrorResponse({ status, error: { message } }),
  );
}

// Derives the cart summary from the supplied cart items.
export function buildSummary(items: CartItem[]): CartSummary {
  return calculateCartSummary(items);
}

// Formats a mock cart with its items and aggregated summary.
export function cartResponse(cart: MockCart): CartResponse {
  return { id: cart.id, items: cart.items, summary: buildSummary(cart.items) };
}

// Produces a stable signature for a topping set so duplicates can be compared reliably.
export function toppingSignature(toppings: Topping[]): string {
  return toppings
    .map((topping) => topping.id)
    .sort((first, second) => first - second)
    .join(',');
}
