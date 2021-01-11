import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { Area, Member, Module, Role } from '@data/types';

@Component({
  selector: 'app-module-area',
  styleUrls: ['./module-area.component.scss'],
  templateUrl: './module-area.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class ModuleAreaComponent implements OnInit, OnChanges {
  @Input() public module: Module;
  @Input() public disabled = false;
  @Input() public wrap = false;
  @Input() public captain?: Member;
  @Input() public membersByRole: Map<Role, Array<Member>>;
  @Input() public dispositions: Array<{ member: Member | null; position?: number }>;

  @Output() public readonly selectionChange: EventEmitter<{ role: Role; member: Member | null }> =
    new EventEmitter<{ role: Role; member: Member | null }>();

  public ngOnInit(): void {
    this.moduleChange();
    // this.moduleChange$.subscribe(() => this.moduleChange());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const change = changes.module;
    if (!change.isFirstChange() && change.previousValue !== change.currentValue) {
      this.moduleChange();
    }
  }

  public moduleChange(): void {
    this.module.areas.forEach((area) => {
      for (let i = area.fromIndex; i < (area.fromIndex + area.toIndex); i += 1) {
        if (this.dispositions[i].member?.role_id !== area.role.id) {
          // eslint-disable-next-line no-null/no-null
          this.dispositions[i].member = null;
        }
      }
      area.options = (this.membersByRole.get(area.role) ?? []).map(member => ({ member, disabled: this.isRegular(member) }));
    });
  }

  public trackByArea(_: number, item: Area): number {
    return item.role.id; // or item.id
  }

  public trackByPosition(_: number, item: number): number {
    return item; // or item.id
  }

  public memberSelectionChange(role: Role, member: Member | null): void {
    this.reloadRegularState(role.id);
    this.selectionChange.emit({ role, member });
  }

  private isRegular(member: Member): boolean {
    return this.dispositions
      .filter(element => element.position && element.position <= 11 && element.member !== null)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  private reloadRegularState(roleId?: number): void {
    this.module.areas.filter(a => roleId === undefined || a.role.id === roleId)
      .forEach(v => v.options.map(o => o.disabled = this.isRegular(o.member)));
  }

}
