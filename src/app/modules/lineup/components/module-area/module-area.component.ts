import { UpperCasePipe } from '@angular/common';
import { booleanAttribute, Component, inject, input, linkedSignal, output } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';

import type { FormationArea, Member, Role } from '@data/interfaces';
import { RoleService } from '@data/services';
import { MemberSelectionComponent } from '@modules/member/components/member-selection/member-selection.component';
import { StickyDirective } from '@shared/directives';
import { RangePipe } from '@shared/pipes';

@Component({
  selector: 'app-module-area[module][dispositions]',
  imports: [FormsModule, MemberSelectionComponent, RangePipe, StickyDirective, UpperCasePipe],
  templateUrl: './module-area.component.html',
  styleUrl: './module-area.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class ModuleAreaComponent {

  readonly #roleService = inject(RoleService);

  public readonly module = input.required<string>();
  public readonly areas = linkedSignal(() => {
    const module = this.module();
    const moduleCounts = this.#getModuleCounts(module); // Refactoring: estrazione logica conteggi

    return this.#generateAreas(this.#roleService.list(), moduleCounts); // Refactoring: estrazione logica aree
  });
  public readonly captain = input<number>();
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly dispositions = input.required<
    {
      member?: Partial<Member> | undefined;
      position?: number;
    }[]
  >();
  public readonly membersByRole = input<Map<Role, Member[]>>();
  public readonly selectionChange = output<{ member?: Partial<Member> | undefined; role: Role }>();
  public readonly wrap = input(false, { transform: booleanAttribute });

  protected memberSelectionChange(role: Role, member: Partial<Member> | undefined): void {
    this.#reloadRegularState(role.id);
    this.selectionChange.emit({ member, role });
  }

  // Refactoring: metodo privato per generare le aree
  #generateAreas(roles: Role[], moduleCounts: number[]): FormationArea[] {
    // eslint-disable-next-line unicorn/no-array-reduce
    return [...roles].reduce((areasAccumulator, role, index) => {
      // Modifica nomenclatura accumulatore
      areasAccumulator.push({
        fromIndex: this.#getStartIndexForArea(areasAccumulator), // Modifica nomenclatura metodo
        options: (this.membersByRole()?.get(role) ?? []).map(member => ({
          disabled: this.#isRegular(member),
          member,
        })),
        role,
        toIndex: moduleCounts[index] ?? 0, // Utilizzo del nome della variabile modificato
      });

      return areasAccumulator;
    }, new Array<FormationArea>()); // Tipizzazione esplicita per new Array
  }

  // Refactoring: metodo privato per ottenere i conteggi dei moduli
  #getModuleCounts(key: string): number[] {
    return key.split('-').map(c => +c);
  }

  // Modifica suggerita per la nomenclatura del metodo
  #getStartIndexForArea(previousAreas: FormationArea[]): number {
    // Modifica nomenclatura parametro e tipo
    return previousAreas.reduce((p, v) => p + v.toIndex, 0);
  }

  #isRegular(member: Member): boolean {
    return this.dispositions()
      .filter(element => element.position !== undefined && element.position <= 11 && element.member !== undefined)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  #reloadRegularState(roleId?: number): void {
    const areas = this.areas().filter(a => roleId === undefined || a.role.id === roleId);
    for (const v of areas) for (const o of v.options) o.disabled = this.#isRegular(o.member);
  }

}
