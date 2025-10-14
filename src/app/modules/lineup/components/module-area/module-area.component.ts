import { UpperCasePipe } from '@angular/common';
import { Component, booleanAttribute, inject, input, linkedSignal, output } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';

import { RoleService } from '@data/services';
import { FormationArea, Member, Role } from '@data/types';
import { MemberSelectionComponent } from '@modules/member/components/member-selection/member-selection.component';
import { StickyDirective } from '@shared/directives';
import { RangePipe } from '@shared/pipes';

@Component({
  selector: 'app-module-area[module][dispositions]',
  styleUrl: './module-area.component.scss',
  templateUrl: './module-area.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  imports: [StickyDirective, FormsModule, MemberSelectionComponent, UpperCasePipe, RangePipe],
})
export class ModuleAreaComponent {
  public module = input.required<string>();
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

  readonly #roleService = inject(RoleService);
  public areas = linkedSignal(() => {
    const module = this.module();
    const moduleCounts = this.#getModuleCounts(module); // Refactoring: estrazione logica conteggi

    return this.#generateAreas(this.#roleService.list(), moduleCounts); // Refactoring: estrazione logica aree
  });

  protected memberSelectionChange(role: Role, member: Member | undefined): void {
    this.#reloadRegularState(role.id);
    this.selectionChange.emit({ role, member });
  }

  #isRegular(member: Member): boolean {
    return this.dispositions()
      .filter(
        (element) =>
          element.position !== undefined && element.position <= 11 && element.member !== undefined,
      )
      .map((element) => element.member?.id)
      .includes(member.id);
  }

  #reloadRegularState(roleId?: number): void {
    for (const v of this.areas().filter((a) => roleId === undefined || a.role.id === roleId))
      for (const o of v.options) o.disabled = this.#isRegular(o.member);
  }

  // Refactoring: metodo privato per ottenere i conteggi dei moduli
  #getModuleCounts(key: string): Array<number> {
    return key.split('-').map((c) => +c);
  }

  // Refactoring: metodo privato per generare le aree
  #generateAreas(roles: Array<Role>, moduleCounts: Array<number>): Array<FormationArea> {
    // eslint-disable-next-line unicorn/no-array-reduce
    return [...roles].reduce((areasAccumulator, role, index) => {
      // Modifica nomenclatura accumulatore
      areasAccumulator.push({
        fromIndex: this.#getStartIndexForArea(areasAccumulator), // Modifica nomenclatura metodo
        options: (this.membersByRole()?.get(role) ?? []).map((member) => ({
          member,
          disabled: this.#isRegular(member),
        })),
        role,
        toIndex: moduleCounts[index] ?? 0, // Utilizzo del nome della variabile modificato
      });

      return areasAccumulator;
    }, new Array<FormationArea>()); // Tipizzazione esplicita per new Array
  }

  // Modifica suggerita per la nomenclatura del metodo
  #getStartIndexForArea(previousAreas: Array<FormationArea>): number {
    // Modifica nomenclatura parametro e tipo
    return previousAreas.reduce((p, v) => p + v.toIndex, 0);
  }
}
