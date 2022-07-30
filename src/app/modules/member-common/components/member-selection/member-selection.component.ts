import { KeyValue } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  NgModel,
  NgModelGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { groupBy } from '@app/functions';
import { RoleService } from '@data/services';
import { Member, MemberOption, Role } from '@data/types';
import { createBoxAnimation, lineupDispositionAnimation } from '@shared/animations';

@Component({
  animations: [lineupDispositionAnimation, createBoxAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: MemberSelectionComponent,
    },
  ],
  selector: 'app-member-selection[name][ngModel]',
  styleUrls: ['./member-selection.component.scss'],
  templateUrl: './member-selection.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }],
})
export class MemberSelectionComponent implements ControlValueAccessor, OnInit {
  @Input() public name!: string;
  @Input() public placeholder = '';
  @Input() public members: Array<MemberOption | Member> = [];
  @Input() public disabled = false;
  @Input() public required = false;
  @Input() public group = false;
  @Input() public captain = false;
  @Input() public size = 100;
  @Input() public width = 100;
  @Input() public height = 100;

  @HostBinding('@lineupDisposition') protected lineupDisposition = '';
  @ViewChild(NgModel, { static: true }) protected ngModelDirective?: NgModel;

  // protected value?: Member;
  protected memberOptions: Array<MemberOption> = [];
  protected memberOptionsMap?: Map<Role, Array<MemberOption>>;

  constructor(
    private readonly roleService: RoleService,
    private readonly changeRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    console.log('init');
    this.memberOptions = this.members.map((m) => (this.isMember(m) ? this.memberToOption(m) : m));
    if (this.group) {
      this.memberOptionsMap = groupBy(
        this.memberOptions,
        (item) => this.roleService.list().get(item.member.role_id)!,
      );
    }
  }

  get value(): Member | undefined {
    return this.ngModelDirective?.value as Member;
  }

  set value(value: Member | undefined) {
    this.ngModelDirective?.valueAccessor?.writeValue(value);
  }

  public registerOnChange(fn: (member: Member | undefined) => undefined): void {
    this.ngModelDirective?.valueAccessor?.registerOnChange(fn);
  }

  public registerOnTouched(fn: () => undefined): void {
    this.ngModelDirective?.valueAccessor?.registerOnTouched(fn);
  }

  public writeValue(obj: Member | undefined): void {
    console.log(this.name);
    console.log(obj);
    // this.value = obj;
    this.ngModelDirective?.valueAccessor?.writeValue(obj);
    this.changeRef.detectChanges();
  }

  public setDisabledState(isDisabled: boolean): void {
    const acc = this.ngModelDirective?.valueAccessor;
    if (acc?.setDisabledState) {
      acc.setDisabledState(isDisabled);
    }
  }

  public change(event: Member | undefined): void {
    this.writeValue(event);
    // this.memberChange.emit(event);
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

  private memberToOption(member: Member): MemberOption {
    return { member };
  }

  private isMember(object: MemberOption | Member): object is Member {
    return 'id' in object;
  }
}
