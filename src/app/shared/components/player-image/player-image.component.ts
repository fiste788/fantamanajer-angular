import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { Member } from '@data/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-image',
  styleUrl: './player-image.component.scss',
  templateUrl: './player-image.component.html',
  standalone: true,
  imports: [LazyLoadImageModule, MatCardModule, NgOptimizedImage],
})
export class PlayerImageComponent {
  @Input() public member?: Member;
  @Input({ transform: booleanAttribute }) public inCard = false;
}
