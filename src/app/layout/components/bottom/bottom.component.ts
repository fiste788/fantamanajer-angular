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

import { LayoutService } from '../../services';
import { BottomBarComponent } from '../bottom-bar/bottom-bar.component';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';

@Component({
  selector: 'app-bottom',
  standalone: true,
  imports: [SpeedDialComponent, BottomBarComponent],
  templateUrl: './bottom.component.html',
  styleUrl: './bottom.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomComponent implements OnInit, OnDestroy {
  public readonly visibility = input.required<VisibilityState>();

  private readonly layoutService = inject(LayoutService);
  private readonly speedDial = viewChild<SpeedDialComponent>('speedDial');
  private readonly subscriptions = new Subscription();

  public ngOnInit(): void {
    this.subscriptions.add(
      this.layoutService.down
        .pipe(
          filter((down) => down),
          tap(() => this.speedDial()?.close()),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
