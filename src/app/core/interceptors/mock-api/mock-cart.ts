import { HttpRequest } from '@angular/common/http';

import { Topping } from '../../models';
import { cartResponse, error, response, toppingSignature } from './mock-response';
import { findCart, writeDatabase } from './mock-storage';
import {
  AddCartItemRequest,
  MockDatabase,
  MockHandlerResult,
  UpdateCartItemRequest,
} from './mock-types';

// Handles the mock cart API, including reads, item creation, adjustments, and removals.
export function handleCartRequest(
  request: HttpRequest<unknown>,
  url: string,
  database: MockDatabase,
): MockHandlerResult {
  const cartMatch = url.match(/^\/api\/cart\/([^/]+)$/);
  if (request.method === 'GET' && cartMatch) {
    return response(200, cartResponse(findCart(database, cartMatch[1])));
  }

  const cartItemMatch = url.match(
    /^\/api\/cart\/([^/]+)\/items(?:\/([^/]+))?$/,
  );
  if (!cartItemMatch) return undefined;

  const cart = findCart(database, cartItemMatch[1]);
  const itemId = cartItemMatch[2];

  if (request.method === 'POST' && !itemId) {
    const body = request.body as AddCartItemRequest;
    const drink = database.drinks.find(
      (item) => item.id === Number(body.drinkId),
    );
    if (!drink) return error(404, 'Drink not found');

    const toppings = (body.toppings ?? [])
      .map((id) => database.toppings.find((topping) => topping.id === id))
      .filter((topping): topping is Topping => Boolean(topping));
    const existing = cart.items.find(
      (item) =>
        item.drinkId === drink.id &&
        toppingSignature(item.toppings) === toppingSignature(toppings),
    );
    if (existing) {
      existing.quantity += Number(body.quantity ?? 1);
    } else {
      cart.items.push({
        id: crypto.randomUUID(),
        drinkId: drink.id,
        drink,
        toppings,
        quantity: Number(body.quantity ?? 1),
      });
    }
    writeDatabase(database);
    return response(200, cartResponse(cart));
  }

  if ((request.method === 'PUT' || request.method === 'DELETE') && itemId) {
    const item = cart.items.find((entry) => entry.id === itemId);
    if (!item) return error(404, 'Cart item not found');
    if (request.method === 'DELETE') {
      cart.items = cart.items.filter((entry) => entry.id !== itemId);
    } else {
      const body = request.body as UpdateCartItemRequest;
      item.quantity = Number(body.quantity);
      if (item.quantity <= 0) {
        cart.items = cart.items.filter((entry) => entry.id !== itemId);
      }
    }
    writeDatabase(database);
    return response(200, cartResponse(cart));
  }

  return undefined;
}
