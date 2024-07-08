import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Subscription, filter, tap } from 'rxjs';

import { VisibilityState } from '@app/enums';
import { closeAnimation } from '@shared/animations';

import { LayoutService } from '../../services';
import { BottomBarComponent } from '../bottom-bar/bottom-bar.component';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';

@Component({
  animations: [closeAnimation],
  selector: 'app-bottom',
  standalone: true,
  imports: [SpeedDialComponent, BottomBarComponent],
  templateUrl: './bottom.component.html',
  styleUrl: './bottom.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomComponent implements OnInit, OnDestroy {
  readonly #layoutService = inject(LayoutService);
  readonly #subscriptions = new Subscription();

  public readonly visibility = input.required<VisibilityState>();
  protected readonly speedDial = viewChild<SpeedDialComponent>('speedDial');

  public ngOnInit(): void {
    this.#subscriptions.add(
      this.#layoutService.down
        .pipe(
          filter((down) => down),
          tap(() => this.speedDial()?.close()),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }
}
