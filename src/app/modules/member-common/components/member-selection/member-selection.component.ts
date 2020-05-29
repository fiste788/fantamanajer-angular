import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

import { createBoxAnimation } from '@shared/animations';
import { Member, Role } from '@shared/models';

export interface MemberOption {
  member: Member;
  disabled: boolean;
}

@Component({
  selector: 'fm-member-selection',
  templateUrl: './member-selection.component.html',
  styleUrls: ['./member-selection.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: MemberSelectionComponent,
    multi: true
  }],
  animations: [createBoxAnimation]
})
export class MemberSelectionComponent implements ControlValueAccessor {
  @Input() value: Member;
  @Input() name: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() memberList: Array<MemberOption> = [];
  @Input() memberMap: Map<Role, Array<MemberOption>>;
  @Input() size = 100;
  @Input() width = 100;
  @Input() height = 100;
  @Input() captain = false;

  @Output() readonly selectionChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();

  onChange = (_: Member) => undefined;
  onTouched = (_: Member) => undefined;

  get val(): Member {
    return this.value;
  }

  set val(val) {
    this.value = val;
    this.onChange(val);
    this.onTouched(val);
  }

  change(event: MatSelectChange): void {
    this.selectionChange.emit(event);
  }

  registerOnChange(fn: (member: Member) => undefined): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (member: Member) => undefined): void {
    this.onTouched = fn;
  }

  writeValue(value: Member): void {
    this.value = value;
  }

  setDisabledState?(isDisabled: boolean): void;

  track(_: number, member: Member): number {
    return member.id;
  }

}
