import { NgOptimizedImage } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import type { Member } from '@data/interfaces';

@Component({
  selector: 'app-player-image',
  imports: [MatCardModule, NgOptimizedImage],
  templateUrl: './player-image.component.html',
  styleUrl: './player-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerImageComponent {

  public readonly fetchpriority = input<'auto' | 'high' | 'low'>('auto');
  public readonly inCard = input(false, { transform: booleanAttribute });
  public readonly member = input<Partial<Member> | undefined>();

}
