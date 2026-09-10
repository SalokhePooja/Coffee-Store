import { HttpRequest } from '@angular/common/http';

import { Topping } from '../../models';
import { error, response } from './mock-response';
import { MockDatabase, MockHandlerResult } from './mock-types';
import { hasDuplicateName } from './mock-validation';
import { writeDatabase } from './mock-storage';

export function handleToppingRequest(
  request: HttpRequest<unknown>,
  url: string,
  database: MockDatabase,
): MockHandlerResult {
  if (request.method === 'GET' && url === '/api/toppings') {
    return response(200, database.toppings);
  }

  const toppingId = Number(url.split('/api/toppings/')[1]);

  if (request.method === 'POST' && url === '/api/toppings') {
    const body = request.body as Partial<Topping>;
    if (
      hasDuplicateName(
        database.toppings.map((topping) => topping.name),
        body.name,
      )
    ) {
      return error(409, 'A topping with this name already exists');
    }

    const created: Topping = {
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
    database.carts.forEach((cart) => {
      cart.items.forEach((item) => {
        item.toppings = item.toppings.filter(
          (topping) => topping.id !== toppingId,
        );
      });
    });
    writeDatabase(database);
    return response(200, { success: true });
  }

  return undefined;
}
