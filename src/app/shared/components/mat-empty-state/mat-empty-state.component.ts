import { animate, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  animations: [
    trigger('createBox', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.4)' }),
        animate(
          '350ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }),
        ),
      ]),
      transition(':leave', [
        animate(
          '350ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(0.4)', opacity: 0 }),
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mat-empty-state[label][icon]',
  styleUrls: ['./mat-empty-state.component.scss'],
  templateUrl: './mat-empty-state.component.html',
  standalone: true,
  imports: [NgIf, MatIconModule],
})
export class MatEmptyStateComponent {
  @Input({ required: true }) public label!: string;
  @Input({ required: true }) public icon!: string;
  @Input() public description?: string;
  @Input({ transform: booleanAttribute }) public rounded = true;
  @Input({ transform: numberAttribute }) public size = 492;

  @HostBinding('@createBox') protected createBox = true;
}
