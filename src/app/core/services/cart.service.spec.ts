import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CartService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads cart-1 from the backend', () => {
    service.getCart().subscribe((cart) => expect(cart.id).toBe('cart-1'));

    const request = http.expectOne('/api/cart/cart-1');
    expect(request.request.method).toBe('GET');
    request.flush({
      id: 'cart-1',
      items: [],
      summary: {
        subtotal: 0,
        promotionName: null,
        discountAmount: 0,
        total: 0,
      },
    });
  });

  it('adds a drink and toppings to the cart', () => {
    const payload = { drinkId: 1, toppings: [2, 4], quantity: 2 };
    service
      .addCartItem(payload)
      .subscribe((cart) => expect(cart.items.length).toBe(1));

    const request = http.expectOne('/api/cart/cart-1/items');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({
      id: 'cart-1',
      items: [{}],
      summary: {
        subtotal: 20,
        promotionName: '25% order threshold',
        discountAmount: 5,
        total: 15,
      },
    });
  });
});
