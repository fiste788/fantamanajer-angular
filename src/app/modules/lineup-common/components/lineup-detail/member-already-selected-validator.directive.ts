import { Directive } from '@angular/core';
import { NG_VALIDATORS, ValidationErrors, Validator, FormGroup, FormControl } from '@angular/forms';

import { Member } from '@data/types';

type LineupForm = FormGroup<{
  dispositions?: FormGroup<Record<number, FormGroup<{ member?: FormControl<Member | undefined> }>>>;
}>;

@Directive({
  providers: [
    {
      multi: true,
      provide: NG_VALIDATORS,
      useExisting: MemberAlreadySelectedValidator,
    },
  ],
  selector: '[appMemberAlreadySelected]',
  standalone: true,
})
export class MemberAlreadySelectedValidator implements Validator {
  public validate(formGroup: LineupForm): ValidationErrors | null {
    const disps = formGroup.controls.dispositions;
    if (disps) {
      const controls = Object.values(disps.controls)
        .map((disp) => disp.controls.member)
        .filter((c) => c !== undefined);
      const ids = controls.map((m) => m?.value?.id);
      const dup = new Set(ids.filter((item, index) => ids.indexOf(item) !== index));
      for (const control of controls) {
        const member = control.value;
        if (member && dup.has(member.id)) {
          control.markAsTouched();
          control.setErrors({ duplicate: true });
        } else if (control.hasError('duplicate') && control.errors) {
          delete control.errors['duplicate'];
          control.updateValueAndValidity();
        }
      }
    }

    // eslint-disable-next-line unicorn/no-null
    return null;
  }
}
