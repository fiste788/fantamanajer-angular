import { Component, Input } from '@angular/core';

import { Member } from '@data/types';

@Component({
  selector: 'app-member-icons',
  styleUrls: ['./member-icons.component.scss'],
  templateUrl: './member-icons.component.html',
})
export class MemberIconsComponent {
  @Input() public member!: Member;
  @Input() public circle = false;
  @Input() public captain = false;
}
