/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  FormGroup,
  FormArray,
  FormControl,
} from '@angular/forms';

import { Lineup } from '@data/types';

type NonUndefined<T> = T extends undefined ? never : T;

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: NonUndefined<T[K]> extends AbstractControl
    ? T[K]
    : NonUndefined<T[K]> extends Array<infer R>
    ? FormArray<FormControl<ControlsOf<R>>>
    : NonUndefined<T[K]> extends Record<any, any>
    ? FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};
@Directive({
  providers: [
    {
      multi: true,
      provide: NG_VALIDATORS,
      useExisting: MemberAlreadySelectedValidator,
    },
  ],
  selector: '[appMemberAlreadySelected]',
})
export class MemberAlreadySelectedValidator implements Validator {
  @Input('appMemberAlreadySelected') public lineup!: Partial<Lineup>;

  public validate(formGroup: FormGroup<ControlsOf<Partial<Lineup>>>): ValidationErrors | null {
    const disp = formGroup.controls.dispositions;
    if (disp) {
      const ids = disp.controls.map((v) => v.value.member.value?.id);
      const dup = new Set(ids.filter((item, index) => ids.indexOf(item) !== index));

      return disp.controls.map((c) => {
        const member = c.value.member.value;
        // eslint-disable-next-line unicorn/no-null
        const errors = member && dup.has(member.id) ? { duplicate: true } : null;
        c.value.member.setErrors(errors);

        return errors;
      });
    }

    // eslint-disable-next-line unicorn/no-null
    return null;
  }
}
