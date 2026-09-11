import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { booleanAttribute, Component, input, linkedSignal, numberAttribute, output, viewChild } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { ControlContainer, FormsModule, NG_VALUE_ACCESSOR, NgModel, NgModelGroup } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import type { Member, MemberOption, Role } from '@data/interfaces';
import { PlayerImageComponent } from '@shared/components/player-image';

import { MemberIconsComponent } from '../member-icons/member-icons.component';

@Component({
  selector: 'app-member-selection[member][name]',
  imports: [DecimalPipe, FormsModule, KeyValuePipe, MatFormFieldModule, MatOptionModule, MatSelectModule, MemberIconsComponent, PlayerImageComponent],
  templateUrl: './member-selection.component.html',
  styleUrl: './member-selection.component.scss',
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: MemberSelectionComponent,
    },
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }],
  host: {
    class: 'member-selection',
  },
})
export class MemberSelectionComponent implements ControlValueAccessor {

  public readonly captain = input(false, { transform: booleanAttribute });
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly height = input(100, { transform: numberAttribute });
  public readonly memberInput = input<Partial<Member>>(undefined, { alias: 'member' });
  public readonly member = linkedSignal(this.memberInput);
  public readonly memberChange = output<Partial<Member> | undefined>();
  public readonly memberList = input<MemberOption[]>([]);
  public readonly memberMap = input<Map<Role, MemberOption[]>>();
  public readonly name = input.required<string>();
  public readonly placeholder = input('');
  public readonly required = input(false, { transform: booleanAttribute });
  public readonly size = input(100, { transform: numberAttribute });
  public readonly width = input(100, { transform: numberAttribute });

  protected readonly ngModelDirective = viewChild.required(NgModel);

  public get value(): Partial<Member> | undefined {
    return (this.ngModelDirective().value ?? undefined) as Partial<Member> | undefined;
  }

  public set value(value: Partial<Member> | undefined) {
    this.ngModelDirective().valueAccessor?.writeValue(value);
  }

  public change(event?: Partial<Member>): void {
    this.writeValue(event);
    this.memberChange.emit(event);
  }

  public compareFn(t1?: Partial<Member>, t2?: Partial<Member>): boolean {
    return t1?.id === t2?.id;
  }

  public onChange = (_: Partial<Member> | null): void => undefined;

  public onTouched = (): void => undefined;

  public registerOnChange(function_: (member?: Partial<Member>) => undefined): void {
    this.ngModelDirective().valueAccessor?.registerOnChange(function_);
  }

  public registerOnTouched(function_: () => undefined): void {
    this.ngModelDirective().valueAccessor?.registerOnTouched(function_);
  }

  public writeValue(object?: Partial<Member>): void {
    this.ngModelDirective().valueAccessor?.writeValue(object);
  }

}
