import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Drink, Topping } from '../../../core/models';
import { nameValidator } from '../../validators/name.validator';
import { priceValidator } from '../../validators/price.validator';

export type CatalogEntity = 'drink' | 'topping';

@Component({
  selector: 'app-catalog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './catalog-form.component.html',
  styleUrl: './catalog-form.component.scss',
})
export class CatalogFormComponent {
  @Input() entity: CatalogEntity = 'drink';
  private resetVersion = 0;
  @Input() set resetToken(value: number) {
    if (value !== this.resetVersion) {
      this.resetVersion = value;
      this.editingId = null;
      this.form.reset({ name: '', price: 0 });
    }
  }
  @Input() set item(value: Drink | Topping | null) {
    this.editingId = value?.id ?? null;
    this.form.reset(value ? { name: value.name, price: value.price } : { name: '', price: 0 });
  }
  @Output() readonly saved = new EventEmitter<{ id: number | null; name: string; price: number }>();
  @Output() readonly cancelled = new EventEmitter<void>();

  readonly form = this.formBuilder.group({
    name: ['', [nameValidator()]],
    price: [0, [priceValidator()]],
  });
  editingId: number | null = null;

  constructor(private readonly formBuilder: FormBuilder) {}

  get title(): string {
    return this.editingId === null
      ? `Create ${this.entity}`
      : `Save ${this.entity} changes`;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saved.emit({
      id: this.editingId,
      name: this.form.controls.name.value ?? '',
      price: Number(this.form.controls.price.value),
    });
  }

  cancel(): void {
    this.editingId = null;
    this.form.reset({ name: '', price: 0 });
    this.cancelled.emit();
  }
}
