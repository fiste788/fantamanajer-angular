import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Member } from '@data/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-image',
  styleUrls: ['./player-image.component.scss'],
  templateUrl: './player-image.component.html',
})
export class PlayerImageComponent {

  @Input() public member?: Member;
  @Input() public inCard = false;

}
