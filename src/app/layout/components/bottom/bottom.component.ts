import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { VisibilityState } from '@app/enums';
import { closeAnimation } from '@shared/animations';

import { LayoutService } from '../../services';
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
  readonly #layoutService = inject(LayoutService);

  public readonly visibility = input.required<VisibilityState>();
  protected readonly speedDial = viewChild<SpeedDialComponent>('speedDial');

  constructor() {
    effect(() => {
      if (this.#layoutService.down()) {
        this.speedDial()?.close();
      }
    });
  }
}
