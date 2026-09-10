import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { forkJoin, retry } from 'rxjs';

import { Drink, Topping } from '../../core/models';
import { CartComponent } from '../../shared/components/cart/cart.component';
import { CatalogListComponent } from '../../shared/components/catalog-list/catalog-list.component';
import { CartStore } from '../../state/cart.store';
import { DrinkService } from '../../core/services/drink.service';
import { ToppingService } from '../../core/services/topping.service';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-customer-page',
  standalone: true,
  imports: [CommonModule, CatalogListComponent, CartComponent],
  templateUrl: './customer-page.component.html',
  styleUrl: './customer-page.component.scss',
})
export class CustomerPageComponent implements OnInit {
  drinks: Drink[] = [];
  toppings: Topping[] = [];
  selectedToppings: Record<number, number[]> = {};
  isLoading = false;

  private readonly drinksApi = inject(DrinkService);
  private readonly toppingsApi = inject(ToppingService);
  private readonly cartStore = inject(CartStore);
  private readonly snackbar = inject(SnackbarService);

  ngOnInit(): void {
    this.loadData();
    this.cartStore.loadCart();
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      drinks: this.drinksApi.getDrinks().pipe(retry({ count: 2, delay: 500 })),
      toppings: this.toppingsApi
        .getToppings()
        .pipe(retry({ count: 2, delay: 500 })),
    }).subscribe({
      next: ({ drinks, toppings }) => {
        this.drinks = this.sortByName(drinks);
        this.toppings = this.sortByName(toppings);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackbar.show(
          'Unable to load drinks and toppings right now.',
          'error',
        );
      },
    });
  }

  toggleTopping(selection: { drinkId: number; toppingId: number }): void {
    const current = this.selectedToppings[selection.drinkId] ?? [];
    const index = current.indexOf(selection.toppingId);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(selection.toppingId);
    }
    this.selectedToppings[selection.drinkId] = current;
  }

  addToCart(drink: Drink): void {
    const selectedIds = this.selectedToppings[drink.id] ?? [];
    const toppings = this.toppings.filter((topping) =>
      selectedIds.includes(topping.id),
    );
    this.cartStore.addItem(drink, toppings);
    this.selectedToppings[drink.id] = [];
  }

  onCartSuccess(message: string): void {
    this.snackbar.show(message);
  }

  onCartError(message: string): void {
    this.snackbar.show(message, 'error');
  }

  private sortByName<T extends Drink | Topping>(items: T[]): T[] {
    return [...items].sort((first, second) =>
      first.name.localeCompare(second.name, undefined, { sensitivity: 'base' }),
    );
  }
}
