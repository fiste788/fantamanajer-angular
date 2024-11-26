import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { Member } from '@data/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-image',
  styleUrl: './player-image.component.scss',
  templateUrl: './player-image.component.html',
  imports: [MatCardModule, NgOptimizedImage],
})
export class PlayerImageComponent {
  public member = input<Member | undefined>();
  public inCard = input(false, { transform: booleanAttribute });
}
