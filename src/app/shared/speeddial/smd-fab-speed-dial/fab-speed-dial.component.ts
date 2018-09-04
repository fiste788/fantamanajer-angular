import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  AfterContentInit,
  ElementRef,
  Renderer2,
  ContentChild,
  HostBinding,
  HostListener
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { SmdFabSpeedDialActionsComponent } from './fab-speed-dial-actions.component';

@Component({
  selector: 'smd-fab-speed-dial',
  template: `
        <div class="smd-fab-speed-dial-container">
            <ng-content select="smd-fab-trigger"></ng-content>
            <ng-content select="smd-fab-actions"></ng-content>
        </div>
    `,
  styleUrls: ['fab-speed-dial.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SmdFabSpeedDialComponent implements AfterContentInit {
  private isInitialized = false;
  private _direction = 'up';
  private _open = false;
  private _animationMode = 'fling';

  /**
     * Whether this speed dial is fixed on screen (user cannot change it by clicking)
     */
  @Input() fixed = false;

  /**
     * Whether this speed dial is opened
     */
  @HostBinding('class.smd-opened')
  @Input()
  get open() {
    return this._open;
  }

  set open(open: boolean) {
    const previousOpen = this._open;
    this._open = open;
    if (previousOpen !== this._open) {
      this.openChange.emit(this._open);
      if (this.isInitialized) {
        this.setActionsVisibility();
      }
    }
  }

  /**
     * The direction of the speed dial. Can be 'up', 'down', 'left' or 'right'
     */
  @Input()
  get direction() {
    return this._direction;
  }

  set direction(direction: string) {
    const previousDir = this._direction;
    this._direction = direction;
    if (previousDir !== this.direction) {
      this._setElementClass(previousDir, false);
      this._setElementClass(this.direction, true);

      if (this.isInitialized) {
        this.setActionsVisibility();
      }
    }
  }

  /**
     * The animation mode to open the speed dial. Can be 'fling' or 'scale'
     */
  @Input()
  get animationMode() {
    return this._animationMode;
  }

  set animationMode(animationMode: string) {
    const previousAnimationMode = this._animationMode;
    this._animationMode = animationMode;
    if (previousAnimationMode !== this._animationMode) {
      this._setElementClass(previousAnimationMode, false);
      this._setElementClass(this.animationMode, true);

      if (this.isInitialized) {
        // To start another detect lifecycle and force the "close" on the action buttons
        Promise.resolve(null).then(() => (this.open = false));
      }
    }
  }

  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ContentChild(SmdFabSpeedDialActionsComponent) _childActions: SmdFabSpeedDialActionsComponent;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngAfterContentInit(): void {
    this.isInitialized = true;
    this.setActionsVisibility();
    this._setElementClass(this.direction, true);
    this._setElementClass(this.animationMode, true);
  }

  /**
     * Toggle the open state of this speed dial
     */
  public toggle() {
    this.open = !this.open;
  }

  @HostListener('click')
  _onClick() {
    if (!this.fixed && this.open) {
      this.open = false;
    }
  }

  setActionsVisibility() {
    if (this.open) {
      this._childActions.show(this.animationMode, this.direction);
    } else {
      this._childActions.hide(this.animationMode, this.direction);
    }
  }

  private _setElementClass(elemClass: string, isAdd: boolean) {
    if (isAdd) {
      this.renderer.addClass(
        this.elementRef.nativeElement,
        `smd-${elemClass}`
      );
    }
  }
}
