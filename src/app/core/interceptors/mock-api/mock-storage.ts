import { MockCart, MockDatabase } from './mock-types';

export const storageKey = 'coffee-store-mock-db-v1';

export const defaultDatabase: MockDatabase = {
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

export function readDatabase(): MockDatabase {
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    const database = structuredClone(defaultDatabase);
    writeDatabase(database);
    return database;
  }

  return JSON.parse(stored) as MockDatabase;
}

export function writeDatabase(database: MockDatabase): void {
  localStorage.setItem(storageKey, JSON.stringify(database));
}

export function findCart(database: MockDatabase, cartId: string): MockCart {
  return database.carts.find((cart) => cart.id === cartId) ?? database.carts[0];
}
