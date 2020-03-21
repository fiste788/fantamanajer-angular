import { Component, Input } from '@angular/core';
import { Member } from '@shared/models';

@Component({
  selector: 'fm-member-icons',
  templateUrl: './member-icons.component.html',
  styleUrls: ['./member-icons.component.scss']
})
export class MemberIconsComponent {
  @Input() member: Member;
  @Input() circle = false;
  @Input() captain = false;
}
