/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  FormGroup,
  FormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { Lineup, Member } from '@data/types';

type NonUndefined<T> = T extends undefined ? never : T;

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: NonUndefined<T[K]> extends AbstractControl
    ? T[K]
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

  public validate(formGroup: UntypedFormGroup): ValidationErrors | null {
    const disp = formGroup.controls['dispositions'] as FormGroup | undefined;
    if (disp) {
      const ids = Object.values(disp.controls)
        .filter((v): v is FormGroup => v instanceof FormGroup)
        .map((v: FormGroup) => {
          const control = v.controls['member']?.value as Member | undefined | null;

          return control?.id;
        });
      const dup = new Set(ids.filter((item, index) => ids.indexOf(item) !== index));
      Object.values(disp.controls)
        .filter((c): c is FormGroup => c instanceof FormGroup)
        .map((c) => {
          const member = c.controls['member']?.value as Member | undefined | null;
          if (member && dup.has(member.id)) {
            c.controls['member']?.setErrors({ duplicate: true });

            return { duplicate: true };
          }
          c.controls['member']?.setErrors(null);

          return null;
        });
    }

    return null;
  }
}
