import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { Area, Disposition, Member, Module, Role } from '@shared/models';

@Component({
  selector: 'fm-module-area',
  templateUrl: './module-area.component.html',
  styleUrls: ['./module-area.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ModuleAreaComponent implements OnInit, OnChanges {
  @Input() module: Module;
  @Input() disabled = false;
  @Input() wrap = false;
  @Input() captain?: Member;
  @Input() membersByRole: Map<Role, Array<Member>>;
  @Input() dispositions: Array<Disposition>;

  @Output() readonly selectionChange: EventEmitter<{ role: Role, member?: Member }> = new EventEmitter<{ role: Role, member?: Member }>();

  ngOnInit(): void {
    this.moduleChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.moduleChange();
  }

  moduleChange(): void {
    this.module.areas.forEach(area => (
      area.options = (this.membersByRole.get(area.role) ?? []).map(member => ({ member, disabled: this.isRegular(member) }))
    ));
  }

  trackByArea(_: number, item: Area): number {
    return item.role.id; // or item.id
  }

  trackByPosition(_: number, item: number): number {
    return item; // or item.id
  }

  memberSelectionChange(role: Role, member?: Member): void {
    this.reloadRegularState(role.id);
    this.selectionChange.emit({ role, member });
  }

  private isRegular(member: Member): boolean {
    return this.dispositions
      .filter(element => element.position <= 11 && element.member !== null)
      .map(element => element.member?.id)
      .includes(member.id);
  }

  private reloadRegularState(roleId?: number): void {
    this.module.areas.filter(a => roleId === undefined || a.role.id === roleId)
      .forEach(v => v.options.map(o => o.disabled = this.isRegular(o.member)));
  }

}
