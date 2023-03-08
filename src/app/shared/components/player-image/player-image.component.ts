import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { Member } from '@data/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-image',
  styleUrls: ['./player-image.component.scss'],
  templateUrl: './player-image.component.html',
  standalone: true,
  imports: [LazyLoadImageModule, MatCardModule],
})
export class PlayerImageComponent {
  @Input() public member?: Member;
  @Input() public inCard = false;
}
