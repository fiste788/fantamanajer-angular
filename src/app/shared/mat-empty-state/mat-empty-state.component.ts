import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fm-mat-empty-state',
  templateUrl: './mat-empty-state.component.html',
  styleUrls: ['./mat-empty-state.component.scss']
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
