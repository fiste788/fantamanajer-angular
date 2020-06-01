import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { createBoxAnimation } from '@shared/animations';
import { Member, MemberOption, Role } from '@shared/models';

@Component({
  selector: 'fm-member-selection',
  templateUrl: './member-selection.component.html',
  styleUrls: ['./member-selection.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  animations: [createBoxAnimation]
})
export class MemberSelectionComponent {
  @Input() member?: Member;
  @Input() name: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() placeholder: string;
  @Input() memberList: Array<MemberOption> = [];
  @Input() memberMap: Map<Role, Array<MemberOption>>;
  @Input() size = 100;
  @Input() width = 100;
  @Input() height = 100;
  @Input() captain = false;

  @Output() readonly memberChange: EventEmitter<Member> = new EventEmitter<Member>();

  change(event?: Member): void {
    this.member = event;
    this.memberChange.emit(event);
  }

  track(_: number, member: Member): number {
    return member.id;
  }

  compareFn(t1: Member, t2: Member): boolean {
    return t1?.id === t2?.id;
  }

}
