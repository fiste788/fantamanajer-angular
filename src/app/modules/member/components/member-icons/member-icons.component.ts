import { PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { booleanAttribute, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import type { Member } from '@data/interfaces';

@Component({
  selector: 'app-member-icons[member]',
  imports: [MatIconModule, MatTooltipModule, PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe],
  templateUrl: './member-icons.component.html',
  styleUrl: './member-icons.component.scss',
  host: {
    class: 'create-box',
  },
})
export class MemberIconsComponent {

  public readonly captain = input(false, { transform: booleanAttribute });
  public readonly circle = input(false, { transform: booleanAttribute });
  public readonly member = input.required<Partial<Member>>();

}
