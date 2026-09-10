import { HttpRequest } from '@angular/common/http';

import { Drink } from '../../models';
import { error, response } from './mock-response';
import { MockDatabase, MockHandlerResult } from './mock-types';
import { hasDuplicateName } from './mock-validation';
import { writeDatabase } from './mock-storage';

export function handleDrinkRequest(
  request: HttpRequest<unknown>,
  url: string,
  database: MockDatabase,
): MockHandlerResult {
  if (request.method === 'GET' && url === '/api/drinks') {
    return response(200, database.drinks);
  }

  const drinkId = Number(url.split('/api/drinks/')[1]);

  if (request.method === 'POST' && url === '/api/drinks') {
    const body = request.body as Partial<Drink>;
    if (
      hasDuplicateName(
        database.drinks.map((drink) => drink.name),
        body.name,
      )
    ) {
      return error(409, 'A drink with this name already exists');
    }

    const created: Drink = {
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

  return undefined;
}
