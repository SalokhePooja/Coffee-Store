import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });
    service = TestBed.inject(OrderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('places an order for the requested cart', () => {
    service.placeOrder('cart-1').subscribe((order) => expect(order.id).toBe('order-1'));

    const request = http.expectOne('/api/orders');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ cartId: 'cart-1' });
    request.flush({ id: 'order-1', total: 9, subtotal: 12, discountAmount: 3, promotionName: '25% order threshold', createdAt: '2026-09-09T10:00:00Z', items: [] });
  });

  it('propagates order request errors', () => {
    let status = 0;
    service.placeOrder('cart-1').subscribe({ error: (error) => status = error.status });

    const request = http.expectOne('/api/orders');
    request.flush({ message: 'Cannot place an empty cart order' }, { status: 400, statusText: 'Bad Request' });
    expect(status).toBe(400);
  });
});
