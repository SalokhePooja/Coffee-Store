import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nameValidator(minLength = 2, maxLength = 50): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();

    if (!value) {
      return { required: true };
    }

    if (value.length < minLength) {
      return { minlength: { requiredLength: minLength, actualLength: value.length } };
    }

    if (value.length > maxLength) {
      return { maxlength: { requiredLength: maxLength, actualLength: value.length } };
    }

    return null;
  };
}
