import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  numberAttribute,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  host: {
    class: 'create-box',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mat-empty-state[label][icon]',
  styleUrl: './mat-empty-state.component.scss',
  templateUrl: './mat-empty-state.component.html',
  imports: [MatIconModule],
})
export class MatEmptyStateComponent {
  public label = input.required<string>();
  public icon = input.required<string>();
  public description = input<string>();
  public rounded = input(true, { transform: booleanAttribute });
  public size = input(492, { transform: numberAttribute });
}
