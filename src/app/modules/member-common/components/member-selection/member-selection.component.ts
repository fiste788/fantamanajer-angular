/* eslint-disable unicorn/no-null */
import { DecimalPipe, KeyValuePipe } from '@angular/common';
import {
  Component,
  HostBinding,
  booleanAttribute,
  input,
  model,
  numberAttribute,
  output,
  viewChild,
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
    MemberIconsComponent,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    DecimalPipe,
    KeyValuePipe,
  ],
})
export class MemberSelectionComponent implements ControlValueAccessor {
  @HostBinding('@lineupDisposition') protected lineupDisposition = '';
  public member = model<Member>();
  public name = input.required<string>();
  public disabled = input(false, { transform: booleanAttribute });
  public required = input(false, { transform: booleanAttribute });
  public placeholder = input('');
  public memberList = input<Array<MemberOption>>([]);
  public memberMap = input<Map<Role, Array<MemberOption>>>();
  public size = input(100, { transform: numberAttribute });
  public width = input(100, { transform: numberAttribute });
  public height = input(100, { transform: numberAttribute });
  public captain = input(false, { transform: booleanAttribute });
  public readonly memberChange = output<Member | undefined>();

  protected ngModelDirective = viewChild.required(NgModel);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange = (_: Member | null): void => undefined;
  public onTouched = (): void => undefined;

  get value(): Member | undefined {
    return (this.ngModelDirective().value ?? undefined) as Member | undefined;
  }

  set value(value: Member | undefined) {
    this.ngModelDirective().valueAccessor?.writeValue(value);
  }

  public registerOnChange(fn: (member?: Member) => undefined): void {
    this.ngModelDirective().valueAccessor?.registerOnChange(fn);
  }

  public registerOnTouched(fn: () => undefined): void {
    this.ngModelDirective().valueAccessor?.registerOnTouched(fn);
  }

  public change(event?: Member): void {
    this.writeValue(event);
    this.memberChange.emit(event);
  }

  public writeValue(obj?: Member): void {
    this.ngModelDirective().valueAccessor?.writeValue(obj);
  }

  public compareFn(t1?: Member, t2?: Member): boolean {
    return t1?.id === t2?.id;
  }
}
