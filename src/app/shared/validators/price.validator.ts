import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function priceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return { required: true };
    }

    const price = Number(value);
    if (!Number.isFinite(price) || price <= 0) {
      return { min: { min: 0.01, actual: value } };
    }

    if (!/^\d+(\.\d{1,2})?$/.test(String(value))) {
      return { decimal: { maxDecimalPlaces: 2 } };
    }

    return null;
  };
}
