import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mat-empty-state[label][icon]',
  imports: [MatIconModule],
  templateUrl: './mat-empty-state.component.html',
  styleUrl: './mat-empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'create-box',
  },
})
export class MatEmptyStateComponent {

  public readonly description = input<string>();
  public readonly icon = input.required<string>();
  public readonly label = input.required<string>();
  public readonly rounded = input(true, { transform: booleanAttribute });
  public readonly size = input(492, { transform: numberAttribute });

}
