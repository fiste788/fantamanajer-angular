import { Directive, Input } from '@angular/core';
import { FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { Lineup } from '@shared/models';

@Directive({
  providers: [{
    multi: true,
    provide: NG_VALIDATORS,
    useExisting: MemberAlreadySelectedValidator,
  }],
  selector: '[appMemberAlreadySelected]',
})
export class MemberAlreadySelectedValidator implements Validator {
  @Input('appMemberAlreadySelected') public lineup: Lineup;

  public validate(formGroup: FormGroup): ValidationErrors | null {
    const disp = formGroup.controls.dispositions as FormGroup;
    if (disp !== undefined) {
      const ids = Object.values(disp.controls)
        .filter((v): v is FormGroup => v instanceof FormGroup)
        .filter((v) => v.controls)
        .map((v: FormGroup) => v.controls.member?.value?.id);
      const dup = ids.filter((item, index) => ids.indexOf(item) !== index);

      Object.values(disp.controls)
        .filter((c): c is FormGroup => c instanceof FormGroup)
        .map((c) => {
          if (dup.includes(c.controls?.member?.value?.id)) {
            c.controls?.member?.setErrors({ duplicate: true });

            return { duplicate: true };
          }
          // tslint:disable-next-line: no-null-keyword
          c.controls?.member?.setErrors(null);

          // tslint:disable-next-line: no-null-keyword
          return null;
        });
    }

    // tslint:disable-next-line: no-null-keyword
    return null;
  }
}
