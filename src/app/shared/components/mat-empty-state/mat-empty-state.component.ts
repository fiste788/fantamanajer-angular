import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

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
  selector: 'app-mat-empty-state',
  styleUrls: ['./mat-empty-state.component.scss'],
  templateUrl: './mat-empty-state.component.html',
})
export class MatEmptyStateComponent {
  @Input() public label!: string;
  @Input() public description!: string;
  @Input() public icon!: string;
  @Input() public rounded = true;
  @Input() public size = 492;

  @HostBinding('@createBox') public createBox = true;
}
