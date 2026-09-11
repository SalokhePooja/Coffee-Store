import { inject, Injectable, signal } from '@angular/core';

import {
  CartItem,
  CartResponse,
  CartSummary,
  Drink,
  Topping,
} from '../core/models';
import { CartService } from '../core/services/cart.service';
import { calculateCartSummary } from '../core/utils/promotion.util';
import { SnackbarService } from '../core/services/snackbar.service';

const emptySummary: CartSummary = {
  subtotal: 0,
  promotionName: null,
  discountAmount: 0,
  total: 0,
};

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly cartItemsState = signal<CartItem[]>([]);
  private readonly cartSummaryState = signal<CartSummary>(emptySummary);

  readonly cartItems = this.cartItemsState.asReadonly();
  readonly cartSummary = this.cartSummaryState.asReadonly();

  private readonly api = inject(CartService);
  private readonly snackbar = inject(SnackbarService);

  // Load the cart and publish its server-provided state.
  loadCart(): void {
    this.api.getCart().subscribe({
      next: (response: CartResponse) => this.applyCartResponse(response),
      error: () => {
        this.cartItemsState.set([]);
        this.cartSummaryState.set({ ...emptySummary });
        this.snackbar.show('Unable to load your cart.', 'error');
      },
    });
  }

  /**
   * Add an item optimistically, then reconcile it with the server response.
   * @param drink 
   * @param toppings 
   */
  addItem(drink: Drink, toppings: Topping[]): void {
    const optimisticItem: CartItem = {
      id: `optimistic-${Date.now()}`,
      drinkId: drink.id,
      drink,
      toppings,
      quantity: 1,
    };
    const nextItems = [...this.cartItemsState(), optimisticItem];

    this.cartItemsState.set(nextItems);
    this.cartSummaryState.set(calculateCartSummary(nextItems));

    this.api
      .addCartItem({
        drinkId: drink.id,
        toppings: toppings.map((topping) => topping.id),
        quantity: 1,
      })
      .subscribe({
        next: (response: CartResponse) => {
          this.applyCartResponse(response);
          this.snackbar.show(`${drink.name} was added to your cart.`);
        },
        error: () => {
          this.cartItemsState.set(
            this.cartItemsState().filter(
              (item) => item.id !== optimisticItem.id,
            ),
          );
          this.cartSummaryState.set(
            calculateCartSummary(this.cartItemsState()),
          );
          this.snackbar.show('Unable to add the drink to your cart.', 'error');
        },
      });
  }

/**
 * Update an item's quantity optimistically and persist the change.
 * @param itemId 
 * @param quantity 
 */
  updateQuantity(itemId: string, quantity: number): void {
    const nextItems = this.cartItemsState().map((item) =>
      item.id === itemId ? { ...item, quantity } : item,
    );

    this.cartItemsState.set(nextItems);
    this.cartSummaryState.set(calculateCartSummary(nextItems));

    this.api.updateCartItem(itemId, quantity).subscribe({
      next: (response: CartResponse) => {
        this.applyCartResponse(response);
        this.snackbar.show('Cart quantity updated.');
      },
      error: () => {
        this.loadCart();
        this.snackbar.show('Unable to update the cart quantity.', 'error');
      },
    });
  }

  
  /**
   * Remove an item optimistically and persist the removal.
   * @param itemId 
   */
  removeItem(itemId: string): void {
    const nextItems = this.cartItemsState().filter(
      (item) => item.id !== itemId,
    );

    this.cartItemsState.set(nextItems);
    this.cartSummaryState.set(calculateCartSummary(nextItems));

    this.api.deleteCartItem(itemId).subscribe({
      next: (response: CartResponse) => {
        this.applyCartResponse(response);
        this.snackbar.show('Item removed from your cart.');
      },
      error: () => {
        this.loadCart();
        this.snackbar.show('Unable to remove the cart item.', 'error');
      },
    });
  }

  /**
   * Reset the cart contents and summary to their empty state.
   */
  clear(): void {
    this.cartItemsState.set([]);
    this.cartSummaryState.set(emptySummary);
  }

  /**
   *  Apply cart items and summary returned by the server.
   * @param response 
   */
  private applyCartResponse(response: CartResponse): void {
    this.cartItemsState.set(response.items ?? []);
    this.cartSummaryState.set(
      response.summary ?? {
        ...emptySummary,
      },
    );
  }
}
