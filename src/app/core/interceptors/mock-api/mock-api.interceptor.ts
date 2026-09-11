import { HttpInterceptorFn } from '@angular/common/http';

import { handleCartRequest } from './mock-cart';
import { handleDrinkRequest } from './mock-drinks';
import { handleOrderRequest } from './mock-orders';
import { handleToppingRequest } from './mock-toppings';
import { readDatabase } from './mock-storage';

// Routes each API request through the mock handlers and falls back to Angular when no mock matches.
export const mockApiInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api')) {
    return next(request);
  }

  const database = readDatabase();
  const url = request.url.split('?')[0];

  const drinkResponse = handleDrinkRequest(request, url, database);
  if (drinkResponse) return drinkResponse;

  const toppingResponse = handleToppingRequest(request, url, database);
  if (toppingResponse) return toppingResponse;

  const cartResponse = handleCartRequest(request, url, database);
  if (cartResponse) return cartResponse;

  const orderResponse = handleOrderRequest(request, url, database);
  if (orderResponse) return orderResponse;

  return next(request);
};
