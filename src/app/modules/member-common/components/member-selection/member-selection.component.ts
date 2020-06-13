import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR, NgModelGroup } from '@angular/forms';

import { createBoxAnimation, lineupDispositionAnimation } from '@shared/animations';
import { Member, MemberOption, Role } from '@shared/models';

@Component({
  selector: 'fm-member-selection',
  templateUrl: './member-selection.component.html',
  styleUrls: ['./member-selection.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }],
  animations: [lineupDispositionAnimation, createBoxAnimation],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MemberSelectionComponent,
      multi: true
    }
  ]
})
export class MemberSelectionComponent implements ControlValueAccessor {
  @Input() member?: Member;
  @Input() name: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() placeholder: string;
  @Input() memberList: Array<MemberOption> = [];
  @Input() memberMap: Map<Role, Array<MemberOption>>;
  @Input() size = 100;
  @Input() width = 100;
  @Input() height = 100;
  @Input() captain = false;

  @Output() readonly memberChange: EventEmitter<Member> = new EventEmitter<Member>();

  @HostBinding('@lineupDisposition') lineupDisposition = '';

  onChange = (_?: Member) => undefined;
  onTouched = () => undefined;

  get val(): Member | undefined {
    return this.member;
  }

  set val(val) {
    this.member = val;
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn: (member: Member) => undefined): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => undefined): void {
    this.onTouched = fn;
  }

  change(event?: Member): void {
    this.member = event;
    this.memberChange.emit(event);
  }

  writeValue(value?: Member): void {
    this.member = value;
  }

  track(_: number, option: MemberOption): number {
    return option.member.id;
  }

  compareFn(t1: Member, t2: Member): boolean {
    return t1?.id === t2?.id;
  }

}
