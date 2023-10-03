import { NgIf, NgFor, NgClass, UpperCasePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { Area, Member, Module, Role } from '@data/types';
import { MemberSelectionComponent } from '@modules/member-common/components/member-selection/member-selection.component';
import { StickyDirective } from '@shared/directives';
import { RangePipe } from '@shared/pipes';

export type NgChanges<Component, Props = ExcludeFunctions<Component>> = {
  [Key in keyof Props]?: SimpleChange;
};

type MarkFunctionPropertyNames<Component> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [Key in keyof Component]: Component[Key] extends Function | Subject<unknown> ? never : Key;
};

type ExcludeFunctionPropertyNames<T> = MarkFunctionPropertyNames<T>[keyof T];

type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;

@Component({
  selector: 'app-module-area[module][dispositions]',
  styleUrls: ['./module-area.component.scss'],
  templateUrl: './module-area.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    StickyDirective,
    FormsModule,
    MemberSelectionComponent,
    UpperCasePipe,
    RangePipe,
  ],
})
export class ModuleAreaComponent implements OnInit, OnChanges {
  @Input({ required: true }) public module!: Module;
  @Input({ required: true }) public dispositions!: Array<{
    member: Member | null;
    position?: number;
  }>;

  @Input() public disabled = false;
  @Input() public wrap = false;
  @Input() public captain?: Member;
  @Input() public membersByRole?: Map<Role, Array<Member>>;

  @Output() public readonly selectionChange: EventEmitter<{
    role: Role;
    member: Member | null;
  }> = new EventEmitter<{ role: Role; member: Member | null }>();

  public ngOnChanges(changes: NgChanges<ModuleAreaComponent>): void {
    const change = changes.module;
    if (!change?.isFirstChange() && change?.previousValue !== change?.currentValue) {
      this.moduleChange();
    }
  }

  public ngOnInit(): void {
    this.moduleChange();
  }

  protected moduleChange(): void {
    for (const area of this.module.areas) {
      for (let i = area.fromIndex; i < area.fromIndex + area.toIndex; i += 1) {
        const disp = this.dispositions[i];
        if (disp && disp.member?.role_id !== area.role.id) {
          // eslint-disable-next-line unicorn/no-null
          disp.member = null;
        }
      }
      area.options = (this.membersByRole?.get(area.role) ?? []).map((member) => ({
        member,
        disabled: this.isRegular(member),
      }));
    }
  }

  protected trackByArea(_: number, item: Area): number {
    return item.role.id; // or item.id
  }

  protected trackByPosition(_: number, item: number): number {
    return item; // or item.id
  }

  protected memberSelectionChange(role: Role, member: Member | null): void {
    this.reloadRegularState(role.id);
    this.selectionChange.emit({ role, member });
  }

  private isRegular(member: Member): boolean {
    return this.dispositions
      .filter((element) => element.position && element.position <= 11 && element.member !== null)
      .map((element) => element.member?.id)
      .includes(member.id);
  }

  private reloadRegularState(roleId?: number): void {
    for (const v of this.module.areas.filter((a) => roleId === undefined || a.role.id === roleId))
      v.options.map((o) => (o.disabled = this.isRegular(o.member)));
  }
}
