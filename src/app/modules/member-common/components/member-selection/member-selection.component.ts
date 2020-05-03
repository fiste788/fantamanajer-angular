import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

import { createBoxAnimation } from '@shared/animations';
import { Member, Role } from '@shared/models';

@Component({
  selector: 'fm-member-selection',
  templateUrl: './member-selection.component.html',
  styleUrls: ['./member-selection.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: MemberSelectionComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [createBoxAnimation]
})
export class MemberSelectionComponent implements ControlValueAccessor {
  @Input() value: Member;
  @Input() name: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() memberList: Array<Member> = [];
  @Input() memberMap: Map<Role, Array<Member>>;
  @Input() size = 100;
  @Input() width = 100;
  @Input() height = 100;
  @Input() captain = false;
  @Input() isMemberDisabled: (m: Member) => boolean;

  @Output() readonly selectionChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();

  @HostBinding('@createBox') createBox = '';

  onChange = (_: Member) => undefined;
  onTouched = (_: Member) => undefined;

  constructor(
    private readonly cd: ChangeDetectorRef
  ) { }

  get val(): Member {
    return this.value;
  }

  set val(val) {
    this.value = val;
    this.onChange(val);
    this.onTouched(val);
    this.cd.detectChanges();
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
