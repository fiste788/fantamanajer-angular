import { NgClass, UpperCasePipe, SlicePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { Component, booleanAttribute, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Member } from '@data/types';

@Component({
  selector: 'app-member-icons[member]',
  styleUrl: './member-icons.component.scss',
  templateUrl: './member-icons.component.html',
  imports: [
    NgClass,
    MatIconModule,
    MatTooltipModule,
    UpperCasePipe,
    SlicePipe,
    PercentPipe,
    TitleCasePipe,
  ],
})
export class MemberIconsComponent {
  public member = input.required<Member>();
  public circle = input(false, { transform: booleanAttribute });
  public captain = input(false, { transform: booleanAttribute });
}
