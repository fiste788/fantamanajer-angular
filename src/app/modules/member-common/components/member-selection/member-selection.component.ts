import { Component, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, NgForm, NG_VALIDATORS } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

import { createBoxAnimation } from '@shared/animations';
import { Member, MemberOption, Role } from '@shared/models';

@Component({
  selector: 'fm-member-selection',
  templateUrl: './member-selection.component.html',
  styleUrls: ['./member-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MemberSelectionComponent,
      multi: true
    }
  ],
  // viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
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

  onChange = (_?: Member) => undefined;
  onTouched = () => undefined;

  get val(): Member {
    return this.value;
  }

  set val(val) {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  change(event: MatSelectChange): void {
    this.onChange(event.value);
    this.selectionChange.emit(event);
  }

  registerOnChange(fn: (member: Member) => undefined): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => undefined): void {
    this.onTouched = fn;
  }

  writeValue(value: Member): void {
    this.value = value;
  }

  setDisabledState?(isDisabled: boolean): void;

  track(_: number, member: Member): number {
    return member.id;
  }

  compareFn(t1: Member, t2: Member): boolean {
    return t1?.id === t2?.id;
  }

}
