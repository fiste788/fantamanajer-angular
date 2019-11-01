import { Component, OnInit, Input } from '@angular/core';
import { createBoxAnimation } from '@app/core/animations';
import { trigger, transition, query, style, animate } from '@angular/animations';

@Component({
  selector: 'fm-mat-empty-state',
  templateUrl: './mat-empty-state.component.html',
  styleUrls: ['./mat-empty-state.component.scss'],
  animations: [
    trigger('createBox', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.4)' }),

        animate('350ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('350ms cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(0.4)', opacity: 0 }),
        )
      ])
    ])
  ]
})
export class MatEmptyStateComponent implements OnInit {

  @Input() label: string;
  @Input() description: string;
  @Input() icon: string;
  @Input() rounded: boolean;
  @Input() size = 492;

  constructor() { }

  ngOnInit() {
  }

}