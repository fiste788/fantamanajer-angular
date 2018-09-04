import {
  Component,
  Input,
  Inject,
  forwardRef,
  HostBinding,
  HostListener
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { SmdFabSpeedDialComponent } from './fab-speed-dial.component';


@Component({
  selector: 'smd-fab-trigger',
  template: `
        <ng-content select="[md-fab], [mat-fab]"></ng-content>
    `
})
export class SmdFabSpeedDialTriggerComponent {
  /**
     * Whether this trigger should spin (360dg) while opening the speed dial
     */
  @HostBinding('class.smd-spin')
  @Input()
  spin = false;

  constructor(
    @Inject(forwardRef(() => SmdFabSpeedDialComponent))
    private _parent: SmdFabSpeedDialComponent
  ) { }

  @HostListener('click', ['$event'])
  _onClick(event: any) {
    if (!this._parent.fixed) {
      this._parent.toggle();
      event.stopPropagation();
    }
  }
}
