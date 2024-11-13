import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  numberAttribute,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  animations: [
    trigger('createBox', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.4)' }),
        animate(
          '500ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          style({ transform: 'scale(1)', opacity: 1 }),
        ),
      ]),
      transition(':leave', [
        animate(
          '350ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
          style({ transform: 'scale(0.4)', opacity: 0 }),
        ),
      ]),
    ]),
  ],
  host: {
    '[@createBox]': '',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mat-empty-state[label][icon]',
  styleUrl: './mat-empty-state.component.scss',
  templateUrl: './mat-empty-state.component.html',
  standalone: true,
  imports: [MatIconModule],
})
export class MatEmptyStateComponent {
  public label = input.required<string>();
  public icon = input.required<string>();
  public description = input<string>();
  public rounded = input(true, { transform: booleanAttribute });
  public size = input(492, { transform: numberAttribute });
}
