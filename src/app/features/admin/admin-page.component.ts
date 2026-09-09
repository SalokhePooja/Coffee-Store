import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin, retry } from 'rxjs';

import { Drink, Topping } from '../../core/models';
import { DrinkService } from '../../core/services/drink.service';
import { ToppingService } from '../../core/services/topping.service';
import { SnackbarService } from '../../shared/ui/snackbar.service';
import { CatalogEntity, CatalogFormComponent } from '../../shared/components/catalog-form/catalog-form.component';
import { CatalogListComponent } from '../../shared/components/catalog-list/catalog-list.component';

interface CatalogFormValue {
  id: number | null;
  name: string;
  price: number;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, CatalogListComponent, CatalogFormComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent implements OnInit {
  drinks: Drink[] = [];
  toppings: Topping[] = [];
  editingDrink: Drink | null = null;
  editingTopping: Topping | null = null;
  drinkFormResetToken = 0;
  toppingFormResetToken = 0;
  isLoading = false;

  constructor(
    private readonly drinksApi: DrinkService,
    private readonly toppingsApi: ToppingService,
    private readonly snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.isLoading = true;
    forkJoin({
      drinks: this.drinksApi.getDrinks().pipe(retry({ count: 4, delay: 1000 })),
      toppings: this.toppingsApi.getToppings().pipe(retry({ count: 4, delay: 1000 })),
    }).subscribe({
      next: ({ drinks, toppings }) => {
        this.drinks = this.sortByName(drinks);
        this.toppings = this.sortByName(toppings);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackbar.show('Unable to load drinks and toppings right now.', 'error');
      },
    });
  }

  saveDrink(value: CatalogFormValue): void {
    if (this.isDuplicate(this.drinks, value.name, value.id)) {
      this.snackbar.show('A drink with this name already exists.', 'error');
      return;
    }
    const request = value.id === null
      ? this.drinksApi.createDrink({ name: value.name, price: value.price })
      : this.drinksApi.updateDrink(value.id, { name: value.name, price: value.price });
    request.subscribe({
      next: (result) => {
        this.drinks = value.id === null
          ? this.sortByName([...this.drinks, result])
          : this.sortByName(this.drinks.map((drink) => drink.id === result.id ? result : drink));
        this.editingDrink = null;
        this.drinkFormResetToken++;
        this.snackbar.show(value.id === null ? 'Drink created.' : 'Drink updated.');
      },
      error: (error: { error?: { message?: string } }) => this.snackbar.show(error?.error?.message ?? 'Unable to save the drink.', 'error'),
    });
  }

  saveTopping(value: CatalogFormValue): void {
    if (this.isDuplicate(this.toppings, value.name, value.id)) {
      this.snackbar.show('A topping with this name already exists.', 'error');
      return;
    }
    const request = value.id === null
      ? this.toppingsApi.createTopping({ name: value.name, price: value.price })
      : this.toppingsApi.updateTopping(value.id, { name: value.name, price: value.price });
    request.subscribe({
      next: (result) => {
        this.toppings = value.id === null
          ? this.sortByName([...this.toppings, result])
          : this.sortByName(this.toppings.map((topping) => topping.id === result.id ? result : topping));
        this.editingTopping = null;
        this.toppingFormResetToken++;
        this.snackbar.show(value.id === null ? 'Topping created.' : 'Topping updated.');
      },
      error: (error: { error?: { message?: string } }) => this.snackbar.show(error?.error?.message ?? 'Unable to save the topping.', 'error'),
    });
  }

  editDrink(drink: Drink): void {
    this.editingDrink = drink;
    this.snackbar.show(`Editing ${drink.name}`);
  }

  editTopping(topping: Topping): void {
    this.editingTopping = topping;
    this.snackbar.show(`Editing ${topping.name}`);
  }

  deleteDrink(id: number): void {
    this.drinksApi.deleteDrink(id).subscribe({
      next: () => {
        this.drinks = this.drinks.filter((drink) => drink.id !== id);
        this.snackbar.show('Drink removed.');
      },
      error: () => this.snackbar.show('Unable to delete the drink.', 'error'),
    });
  }

  deleteTopping(id: number): void {
    this.toppingsApi.deleteTopping(id).subscribe({
      next: () => {
        this.toppings = this.toppings.filter((topping) => topping.id !== id);
        this.snackbar.show('Topping removed.');
      },
      error: () => this.snackbar.show('Unable to delete the topping.', 'error'),
    });
  }

  cancel(entity: CatalogEntity): void {
    if (entity === 'drink') this.editingDrink = null;
    else this.editingTopping = null;
  }

  private isDuplicate(items: Array<Drink | Topping>, name: string, id: number | null): boolean {
    return items.some((item) => item.id !== id && this.hasSameName(item.name, name));
  }

  private hasSameName(first: string, second: string): boolean {
    return first.trim().toLocaleLowerCase() === second.trim().toLocaleLowerCase();
  }

  private sortByName<T extends Drink | Topping>(items: T[]): T[] {
    return [...items].sort((first, second) =>
      first.name.localeCompare(second.name, undefined, { sensitivity: 'base' }),
    );
  }
}
