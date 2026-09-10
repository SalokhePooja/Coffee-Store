import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import {
  CartItem,
  CartResponse,
  CartSummary,
  Drink,
  Order,
  Topping,
} from '../models';
import { calculateCartSummary } from '../utils/promotion.util';

interface MockDatabase {
  drinks: Drink[];
  toppings: Topping[];
  carts: { id: string; items: CartItem[] }[];
  orders: Order[];
}

const storageKey = 'coffee-store-mock-db-v1';

const defaultDatabase: MockDatabase = {
  drinks: [
    { id: 1, name: 'Black coffee', price: 4 },
    { id: 2, name: 'Latte', price: 5 },
    { id: 3, name: 'Mocha', price: 6 },
    { id: 4, name: 'Tea', price: 3 },
  ],
  toppings: [
    { id: 1, name: 'Milk coffee', price: 2 },
    { id: 2, name: 'Hazelnut syrup', price: 3 },
    { id: 3, name: 'Chocolate sauce', price: 5 },
    { id: 4, name: 'Lemon', price: 2 },
  ],
  carts: [{ id: 'cart-1', items: [] }],
  orders: [],
};

function readDatabase(): MockDatabase {
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    const database = structuredClone(defaultDatabase);
    writeDatabase(database);
    return database;
  }

  return JSON.parse(stored) as MockDatabase;
}

function writeDatabase(database: MockDatabase): void {
  localStorage.setItem(storageKey, JSON.stringify(database));
}

function response<T>(status: number, body: T): Observable<HttpResponse<T>> {
  return of(new HttpResponse({ status, body }));
}

function error(status: number, message: string): Observable<never> {
  return throwError(
    () => new HttpErrorResponse({ status, error: { message } }),
  );
}

function buildSummary(items: CartItem[]): CartSummary {
  return calculateCartSummary(items);
}

function findCart(database: MockDatabase, cartId: string) {
  return database.carts.find((cart) => cart.id === cartId) ?? database.carts[0];
}

function cartResponse(cart: { id: string; items: CartItem[] }): CartResponse {
  return { id: cart.id, items: cart.items, summary: buildSummary(cart.items) };
}

function toppingSignature(toppings: Topping[]): string {
  return toppings
    .map((topping) => topping.id)
    .sort((first, second) => first - second)
    .join(',');
}

export const mockApiInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (!request.url.startsWith('/api')) {
    return next(request);
  }

  const database = readDatabase();
  const url = request.url.split('?')[0];

  if (request.method === 'GET' && url === '/api/drinks') {
    return response(200, database.drinks);
  }
  if (request.method === 'GET' && url === '/api/toppings') {
    return response(200, database.toppings);
  }

  const drinkId = Number(url.split('/api/drinks/')[1]);
  if (request.method === 'POST' && url === '/api/drinks') {
    const body = request.body as Partial<Drink>;
    if (
      database.drinks.some(
        (drink) => drink.name.toLowerCase() === body.name?.trim().toLowerCase(),
      )
    ) {
      return error(409, 'A drink with this name already exists');
    }
    const created = {
      id: Math.max(0, ...database.drinks.map((drink) => drink.id)) + 1,
      name: body.name ?? '',
      price: Number(body.price),
    };
    database.drinks.push(created);
    writeDatabase(database);
    return response(201, created);
  }
  if (request.method === 'PUT' && url.startsWith('/api/drinks/')) {
    const drink = database.drinks.find((item) => item.id === drinkId);
    if (!drink) return error(404, 'Drink not found');
    const body = request.body as Partial<Drink>;
    drink.name = body.name ?? drink.name;
    drink.price = Number(body.price ?? drink.price);
    writeDatabase(database);
    return response(200, drink);
  }
  if (request.method === 'DELETE' && url.startsWith('/api/drinks/')) {
    database.drinks = database.drinks.filter((drink) => drink.id !== drinkId);
    database.carts.forEach(
      (cart) =>
        (cart.items = cart.items.filter((item) => item.drinkId !== drinkId)),
    );
    writeDatabase(database);
    return response(200, { success: true });
  }

  const toppingId = Number(url.split('/api/toppings/')[1]);
  if (request.method === 'POST' && url === '/api/toppings') {
    const body = request.body as Partial<Topping>;
    if (
      database.toppings.some(
        (topping) =>
          topping.name.toLowerCase() === body.name?.trim().toLowerCase(),
      )
    ) {
      return error(409, 'A topping with this name already exists');
    }
    const created = {
      id: Math.max(0, ...database.toppings.map((topping) => topping.id)) + 1,
      name: body.name ?? '',
      price: Number(body.price),
    };
    database.toppings.push(created);
    writeDatabase(database);
    return response(201, created);
  }
  if (request.method === 'PUT' && url.startsWith('/api/toppings/')) {
    const topping = database.toppings.find((item) => item.id === toppingId);
    if (!topping) return error(404, 'Topping not found');
    const body = request.body as Partial<Topping>;
    topping.name = body.name ?? topping.name;
    topping.price = Number(body.price ?? topping.price);
    writeDatabase(database);
    return response(200, topping);
  }
  if (request.method === 'DELETE' && url.startsWith('/api/toppings/')) {
    database.toppings = database.toppings.filter(
      (topping) => topping.id !== toppingId,
    );
    database.carts.forEach((cart) =>
      cart.items.forEach((item) => {
        item.toppings = item.toppings.filter(
          (topping) => topping.id !== toppingId,
        );
      }),
    );
    writeDatabase(database);
    return response(200, { success: true });
  }

  const cartMatch = url.match(/^\/api\/cart\/([^/]+)$/);
  if (request.method === 'GET' && cartMatch) {
    return response(200, cartResponse(findCart(database, cartMatch[1])));
  }

  const cartItemMatch = url.match(
    /^\/api\/cart\/([^/]+)\/items(?:\/([^/]+))?$/,
  );
  if (cartItemMatch) {
    const cart = findCart(database, cartItemMatch[1]);
    const itemId = cartItemMatch[2];

    if (request.method === 'POST' && !itemId) {
      const body = request.body as {
        drinkId: number;
        toppings: number[];
        quantity?: number;
      };
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
        item.quantity = Number((request.body as { quantity: number }).quantity);
        if (item.quantity <= 0)
          cart.items = cart.items.filter((entry) => entry.id !== itemId);
      }
      writeDatabase(database);
      return response(200, cartResponse(cart));
    }
  }

  if (request.method === 'POST' && url === '/api/orders') {
    const cartId = (request.body as { cartId?: string })?.cartId ?? 'cart-1';
    const cart = findCart(database, cartId);
    if (!cart.items.length)
      return error(400, 'Cannot place an empty cart order');
    const summary = buildSummary(cart.items);
    const order: Order = {
      id: `order-${Date.now()}`,
      ...summary,
      createdAt: new Date().toISOString(),
      items: cart.items,
    };
    database.orders.push(order);
    cart.items = [];
    writeDatabase(database);
    return response(201, order);
  }

  return next(request);
};
