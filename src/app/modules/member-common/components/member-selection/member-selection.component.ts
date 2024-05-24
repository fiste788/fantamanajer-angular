/* eslint-disable unicorn/no-null */
import { NgIf, NgFor, DecimalPipe, KeyValuePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  NgModel,
  NgModelGroup,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Member, MemberOption, Role } from '@data/types';
import { createBoxAnimation, lineupDispositionAnimation } from '@shared/animations';
import { PlayerImageComponent } from '@shared/components/player-image';

import { MemberIconsComponent } from '../member-icons/member-icons.component';

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
  styleUrl: './member-selection.component.scss',
  templateUrl: './member-selection.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }],
  standalone: true,
  imports: [
    MatFormFieldModule,
    PlayerImageComponent,
    NgIf,
    MemberIconsComponent,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    NgFor,
    DecimalPipe,
    KeyValuePipe,
  ],
})
export class MemberSelectionComponent implements ControlValueAccessor {
  @Input({ required: true }) public member!: Member | null;
  @Input({ required: true }) public name!: string;
  @Input({ transform: booleanAttribute }) public disabled = false;
  @Input({ transform: booleanAttribute }) public required = false;
  @Input() public placeholder = '';
  @Input() public memberList: Array<MemberOption> = [];
  @Input() public memberMap?: Map<Role, Array<MemberOption>>;
  @Input({ transform: numberAttribute }) public size = 100;
  @Input({ transform: numberAttribute }) public width = 100;
  @Input({ transform: numberAttribute }) public height = 100;
  @Input({ transform: booleanAttribute }) public captain = false;

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

  public compareFn(t1: Member | null, t2: Member | null): boolean {
    return t1?.id === t2?.id;
  }
}
