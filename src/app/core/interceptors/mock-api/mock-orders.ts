import { HttpRequest } from '@angular/common/http';

import { Order } from '../../models';
import { buildSummary, error, response } from './mock-response';
import { findCart, writeDatabase } from './mock-storage';
import {
  CreateOrderRequest,
  MockDatabase,
  MockHandlerResult,
} from './mock-types';

// Creates a mock order from the active cart when a valid order request is received.
export function handleOrderRequest(
  request: HttpRequest<unknown>,
  url: string,
  database: MockDatabase,
): MockHandlerResult {
  if (request.method !== 'POST' || url !== '/api/orders') return undefined;

  const cartId = (request.body as CreateOrderRequest)?.cartId ?? 'cart-1';
  const cart = findCart(database, cartId);
  if (!cart.items.length) return error(400, 'Cannot place an empty cart order');

  const summary = buildSummary(cart.items);
  const order: Order = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    ...summary,
    createdAt: new Date().toISOString(),
    items: cart.items,
  };
  database.orders.push(order);
  cart.items = [];
  writeDatabase(database);
  return response(201, order);
}
