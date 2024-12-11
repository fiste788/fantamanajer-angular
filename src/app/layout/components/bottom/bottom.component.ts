import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { VisibilityState } from '@app/enums';
import { closeAnimation } from '@shared/animations';

import { BottomBarComponent } from '../bottom-bar/bottom-bar.component';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';

@Component({
  animations: [closeAnimation],
  selector: 'app-bottom',
  imports: [SpeedDialComponent, BottomBarComponent],
  templateUrl: './bottom.component.html',
  styleUrl: './bottom.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomComponent {
  public readonly visibilitySpeedDial = input.required<VisibilityState>();
}
