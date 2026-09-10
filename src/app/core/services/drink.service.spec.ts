import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DrinkService } from './drink.service';
import { provideHttpClient } from '@angular/common/http';

describe('DrinkService', () => {
  let service: DrinkService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrinkService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DrinkService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets drinks from the drinks endpoint', () => {
    service.getDrinks().subscribe((drinks) => {
      expect(drinks).toEqual([{ id: 1, name: 'Latte', price: 5 }]);
    });

    const request = http.expectOne('/api/drinks');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 1, name: 'Latte', price: 5 }]);
  });

  it('creates a drink with the supplied payload', () => {
    service.createDrink({ name: 'Mocha', price: 6 }).subscribe((drink) => {
      expect(drink.name).toBe('Mocha');
    });

    const request = http.expectOne('/api/drinks');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Mocha', price: 6 });
    request.flush({ id: 2, name: 'Mocha', price: 6 });
  });
});
