/// <reference types="jasmine" />

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CartResponse } from '../core/models';
import { CartService } from '../core/services/cart.service';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  let service: CartStore;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });

    service = TestBed.inject(CartStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads the cart response and exposes the latest summary', () => {
    const response: CartResponse = {
      id: 'cart-1',
      items: [
        {
          id: 'item-1',
          drinkId: 1,
          drink: { id: 1, name: 'Black Coffee', price: 4 },
          toppings: [{ id: 1, name: 'Milk Coffee', price: 2 }],
          quantity: 2
        }
      ],
      summary: {
        subtotal: 12,
        promotionName: '25% order threshold',
        discountAmount: 3,
        total: 9
      }
    };

    service.loadCart();

    const request = http.expectOne('/api/cart/cart-1');
    expect(request.request.method).toBe('GET');
    request.flush(response);

    expect(service.cartSummary().subtotal).toBe(12);
    expect(service.cartSummary().promotionName).toBe('25% order threshold');
    expect(service.cartSummary().discountAmount).toBe(3);
    expect(service.cartSummary().total).toBe(9);
  });

  it('shows a newly added item immediately before the server responds', () => {
    const drink = { id: 1, name: 'Black Coffee', price: 4 };
    const topping = { id: 2, name: 'Milk', price: 1 };

    service.addItem(drink, [topping]);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].drink.name).toBe('Black Coffee');
    expect(service.cartItems()[0].toppings[0].name).toBe('Milk');
    expect(service.cartSummary().subtotal).toBe(5);
    expect(service.cartSummary().total).toBe(5);

    const request = http.expectOne('/api/cart/cart-1/items');
    expect(request.request.method).toBe('POST');

    request.flush({
      id: 'cart-1',
      items: [{
        id: 'item-1',
        drinkId: 1,
        drink,
        toppings: [topping],
        quantity: 1
      }],
      summary: {
        subtotal: 5,
        promotionName: null,
        discountAmount: 0,
        total: 5
      }
    });

    expect(service.cartItems().length).toBe(1);
    expect(service.cartSummary().total).toBe(5);
  });
});
