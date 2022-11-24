import { NgModel } from '@angular/forms';

export function getError(field: NgModel): string {
  return field.errors === null ? '' : Object.values<string>(field.errors).join(' - ');
}
