/* eslint-disable unicorn/no-null */
import { KeyValue } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  NgModel,
  NgModelGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { Member, MemberOption, Role } from '@data/types';
import { createBoxAnimation, lineupDispositionAnimation } from '@shared/animations';

@Component({
  animations: [lineupDispositionAnimation, createBoxAnimation],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: MemberSelectionComponent,
    },
  ],
  selector: 'app-member-selection[member][name]',
  styleUrls: ['./member-selection.component.scss'],
  templateUrl: './member-selection.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }],
})
export class MemberSelectionComponent implements ControlValueAccessor {
  @Input() public member!: Member | null;
  @Input() public name!: string;
  @Input() public disabled = false;
  @Input() public required = false;
  @Input() public placeholder = '';
  @Input() public memberList: Array<MemberOption> = [];
  @Input() public memberMap?: Map<Role, Array<MemberOption>>;
  @Input() public size = 100;
  @Input() public width = 100;
  @Input() public height = 100;
  @Input() public captain = false;

  @Output()
  public readonly memberChange: EventEmitter<Member | null> = new EventEmitter<Member | null>();

  @HostBinding('@lineupDisposition') protected lineupDisposition = '';
  @ViewChild(NgModel, { static: true }) protected ngModelDirective?: NgModel;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange = (_: Member | null): void => undefined;
  public onTouched = (): void => undefined;

  get value(): Member | null {
    return (this.ngModelDirective?.value ?? null) as Member | null;
  }

  set value(value: Member | null) {
    this.ngModelDirective?.valueAccessor?.writeValue(value);
  }

  public registerOnChange(fn: (member: Member | undefined) => undefined): void {
    this.ngModelDirective?.valueAccessor?.registerOnChange(fn);
  }

  public registerOnTouched(fn: () => undefined): void {
    this.ngModelDirective?.valueAccessor?.registerOnTouched(fn);
  }

  public change(event: Member | null): void {
    this.writeValue(event);
    this.memberChange.emit(event);
  }

  public writeValue(obj: Member | null): void {
    this.ngModelDirective?.valueAccessor?.writeValue(obj);
  }

  public track(_: number, option: MemberOption): number {
    return option.member.id;
  }

  public trackMember(_: number, option: KeyValue<Role, Array<MemberOption>>): number {
    return option.key.id;
  }

  public compareFn(t1: Member | null, t2: Member | null): boolean {
    return t1?.id === t2?.id;
  }
}
