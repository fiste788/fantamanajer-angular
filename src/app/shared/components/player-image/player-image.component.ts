import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { Member } from '@shared/models';

@Component({
  selector: 'fm-player-image',
  templateUrl: './player-image.component.html',
  styleUrls: ['./player-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerImageComponent {

  @Input() member?: Member;
  @Input() inCard = false;

}
