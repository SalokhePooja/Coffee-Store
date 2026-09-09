import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Drink, Topping } from '../../../core/models';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog-list.component.html',
  styleUrl: './catalog-list.component.scss',
})
export class CatalogListComponent {
  @Input() drinks: Drink[] = [];
  @Input() toppings: Topping[] = [];
  @Input() showActions = false;
  @Input() showDrinks = true;
  @Input() showToppings = true;
  @Input() selectedToppings: Record<number, number[]> = {};

  @Output() readonly addToCart = new EventEmitter<Drink>();
  @Output() readonly toppingToggled = new EventEmitter<{ drinkId: number; toppingId: number }>();
  @Output() readonly editDrink = new EventEmitter<Drink>();
  @Output() readonly deleteDrink = new EventEmitter<number>();
  @Output() readonly editTopping = new EventEmitter<Topping>();
  @Output() readonly deleteTopping = new EventEmitter<number>();

  isSelected(drinkId: number, toppingId: number): boolean {
    return (this.selectedToppings[drinkId] ?? []).includes(toppingId);
  }

  trackDrinkId(index: number, drink: Drink): number {
    return drink.id;
  }

  trackToppingId(index: number, topping: Topping): number {
    return topping.id;
  }
}
