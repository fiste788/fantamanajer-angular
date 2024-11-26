import { NgClass, UpperCasePipe } from '@angular/common';
import { Component, SimpleChange, booleanAttribute, effect, input, output } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { Member, Module, Role } from '@data/types';
import { MemberSelectionComponent } from '@modules/member-common/components/member-selection/member-selection.component';
import { StickyDirective } from '@shared/directives';
import { RangePipe } from '@shared/pipes';

export type NgChanges<Component, Props = ExcludeFunctions<Component>> = {
  [Key in keyof Props]?: SimpleChange;
};

type MarkFunctionPropertyNames<Component> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [Key in keyof Component]: Component[Key] extends Function | Subject<unknown> ? never : Key;
};

type ExcludeFunctionPropertyNames<T> = MarkFunctionPropertyNames<T>[keyof T];

type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;

@Component({
  selector: 'app-module-area[module][dispositions]',
  styleUrl: './module-area.component.scss',
  templateUrl: './module-area.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  imports: [
    NgClass,
    StickyDirective,
    FormsModule,
    MemberSelectionComponent,
    UpperCasePipe,
    RangePipe,
  ],
})
export class ModuleAreaComponent {
  public module = input.required<Module>();
  public dispositions = input.required<
    Array<{
      member?: Member;
      position?: number;
    }>
  >();

  public disabled = input(false, { transform: booleanAttribute });
  public wrap = input(false, { transform: booleanAttribute });
  public captain = input<number>();
  public membersByRole = input<Map<Role, Array<Member>>>();
  public readonly selectionChange = output<{ role: Role; member?: Member }>();

  constructor() {
    effect(() => {
      this.moduleChange();
    });
  }

  protected moduleChange(): void {
    for (const area of this.module().areas) {
      for (let i = area.fromIndex; i < area.fromIndex + area.toIndex; i += 1) {
        const disp = this.dispositions()[i];
        if (disp && disp.member?.role_id !== area.role.id) {
          disp.member = undefined;
        }
      }
      area.options = (this.membersByRole()?.get(area.role) ?? []).map((member) => ({
        member,
        disabled: this.#isRegular(member),
      }));
    }
  }

  protected memberSelectionChange(role: Role, member: Member | undefined): void {
    this.#reloadRegularState(role.id);
    this.selectionChange.emit({ role, member });
  }

  #isRegular(member: Member): boolean {
    return this.dispositions()
      .filter((element) => element.position && element.position <= 11 && element.member)
      .map((element) => element.member?.id)
      .includes(member.id);
  }

  #reloadRegularState(roleId?: number): void {
    for (const v of this.module().areas.filter((a) => roleId === undefined || a.role.id === roleId))
      for (const o of v.options) o.disabled = this.#isRegular(o.member);
  }
}
