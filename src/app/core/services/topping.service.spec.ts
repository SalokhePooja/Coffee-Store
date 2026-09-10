import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ToppingService } from './topping.service';
import { provideHttpClient } from '@angular/common/http';

describe('ToppingService', () => {
  let service: ToppingService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ToppingService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ToppingService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets toppings from the toppings endpoint', () => {
    service.getToppings().subscribe((toppings) => {
      expect(toppings.length).toBe(1);
      expect(toppings[0].name).toBe('Lemon');
    });

    const request = http.expectOne('/api/toppings');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 4, name: 'Lemon', price: 2 }]);
  });

  it('updates a topping using its id and payload', () => {
    service
      .updateTopping(4, { name: 'Fresh lemon', price: 2.5 })
      .subscribe((topping) => {
        expect(topping.price).toBe(2.5);
      });

    const request = http.expectOne('/api/toppings/4');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ name: 'Fresh lemon', price: 2.5 });
    request.flush({ id: 4, name: 'Fresh lemon', price: 2.5 });
  });
});
