import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { CartItem } from '../../../core/models';
import { OrderService } from '../../../core/services/order.service';
import { CartStore } from '../../../state/cart.store';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  readonly cartItems = this.cartStore.cartItems;
  readonly summary = this.cartStore.cartSummary;

  @Output() readonly success = new EventEmitter<string>();
  @Output() readonly error = new EventEmitter<string>();

  constructor(
    private readonly orderService: OrderService,
    private readonly cartStore: CartStore,
  ) {}

  updateQuantity(item: CartItem, delta: number): void {
    const nextQuantity = item.quantity + delta;
    if (nextQuantity <= 0) {
      this.removeItem(item.id);
      return;
    }
    this.cartStore.updateQuantity(item.id, nextQuantity);
  }

  removeItem(itemId: string): void {
    this.cartStore.removeItem(itemId);
  }

  placeOrder(): void {
    this.orderService.placeOrder('cart-1').subscribe({
      next: (order) => {
        this.cartStore.clear();
        this.success.emit(`Order ${order.id} placed successfully! Final amount: €${order.total.toFixed(2)}`);
      },
      error: (requestError: { error?: { message?: string } }) => {
        this.error.emit(requestError?.error?.message ?? 'Unable to place the order.');
      },
    });
  }

  formatToppingNames(item: CartItem): string {
    return item.toppings.length
      ? item.toppings.map((topping) => topping.name).join(', ')
      : 'Plain drink';
  }

  trackCartItemId(index: number, item: CartItem): string {
    return item.id;
  }
}
