import {
  NgIf,
  NgClass,
  UpperCasePipe,
  SlicePipe,
  PercentPipe,
  TitleCasePipe,
} from '@angular/common';
import { Component, Input, booleanAttribute } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Member } from '@data/types';

@Component({
  selector: 'app-member-icons[member]',
  styleUrl: './member-icons.component.scss',
  templateUrl: './member-icons.component.html',
  standalone: true,
  imports: [
    NgIf,
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
  @Input({ required: true }) public member!: Member;
  @Input({ transform: booleanAttribute }) public circle = false;
  @Input({ transform: booleanAttribute }) public captain = false;
}
