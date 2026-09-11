import { CartItem, CartSummary } from '../models';

/**
 * Calculates the cart subtotal, best promotion, discount, and total.
 * @param items 
 * @returns 
 */
export function calculateCartSummary(items: CartItem[]): CartSummary {
  // Count every drink represented by the cart items.
  const drinkCount = items.reduce((count, item) => count + item.quantity, 0);
  // Sum drink and topping prices for the cart subtotal.
  const subtotal = round(
    items.reduce((sum, item) => {
      const toppingsTotal = item.toppings.reduce(
        (toppingSum, topping) => toppingSum + topping.price,
        0,
      );
      return sum + (item.drink.price + toppingsTotal) * item.quantity;
    }, 0),
  );

  const thresholdDiscount = subtotal >= 12 ? subtotal * 0.25 : 0;
  const cheapestDrinkDiscount =
    drinkCount >= 3
      ? Math.min(
          // Find the price of each drink including its toppings.
          ...items.map(
            (item) =>
              item.drink.price +
              item.toppings.reduce((sum, topping) => sum + topping.price, 0),
          ),
        )
      : 0;

  const promotions = [
    { name: '25% order threshold', value: thresholdDiscount },
    { name: 'Cheapest drink free', value: cheapestDrinkDiscount },
  ];

  // Keep only applicable promotions and rank them by discount value.
  const promotion = promotions
    .filter((option) => option.value > 0)
    .sort((first, second) => second.value - first.value)[0];
    
  const discountAmount = round(promotion?.value ?? 0);

  return {
    subtotal,
    promotionName: promotion?.name ?? null,
    discountAmount,
    total: round(subtotal - discountAmount),
  };
}

// Round monetary values to two decimal places.
function round(value: number): number {
  return Number(value.toFixed(2));
}
