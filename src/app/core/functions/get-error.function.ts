import { NgModel } from '@angular/forms';

export function getError(field: NgModel): string {
  const errors: Array<string> = [];
  if (field.errors !== null) {
    Object.values<string>(field.errors).forEach((err) => errors.push(err));
  }

  return errors.join(' - ');
}
