import {
  Component,
  AfterContentInit,
  Renderer2,
  Inject,
  forwardRef,
  ContentChildren,
  QueryList,
  HostListener
} from '@angular/core';
import { MatButton } from '@angular/material/button';

const Z_INDEX_ITEM = 23;


@Component({
  selector: 'smd-fab-actions',
  template: `
        <ng-content select="[md-mini-fab], [mat-mini-fab]"></ng-content>
    `
})
export class SmdFabSpeedDialActionsComponent implements AfterContentInit {
  @ContentChildren(MatButton) _buttons: QueryList<MatButton>;

  constructor(
    private renderer: Renderer2
  ) { }

  ngAfterContentInit(): void {
    this._buttons.changes.subscribe(() => {
      this.initButtonStates();
    });

    this.initButtonStates();
  }

  private initButtonStates() {
    this._buttons.toArray().forEach((button, i) => {
      this.renderer.addClass(
        button._getHostElement(),
        'smd-fab-action-item'
      );
      this.changeElementStyle(
        button._getHostElement(),
        'z-index',
        '' + (Z_INDEX_ITEM - i)
      );
    });
  }

  show(mode, direction) {
    if (this._buttons) {
      this._buttons.toArray().forEach((button, i) => {
        let transitionDelay = 0;
        let transform;
        this.changeElementStyle(
          button._getHostElement().parentElement,
          'max-height',
          'auto'
        );
        if (mode === 'scale') {
          // Incremental transition delay of 65ms for each action button
          transitionDelay = 3 + 65 * i;
          transform = 'scale(1)';
        } else {
          transform = this.getTranslateFunction('0', direction);
        }
        this.changeElementStyle(
          button._getHostElement(),
          'transition-delay',
          transitionDelay + 'ms'
        );
        this.changeElementStyle(button._getHostElement(), 'opacity', '1');
        this.changeElementStyle(
          button._getHostElement(),
          'transform',
          transform
        );
      });
    }
  }

  hide(mode, direction) {
    if (this._buttons) {
      this._buttons.toArray().forEach((button, i) => {
        let opacity = '1';
        let transitionDelay = 0;
        let transform;
        if (mode === 'scale') {
          transitionDelay = 3 - 65 * i;
          transform = 'scale(0)';
          opacity = '0';
        } else {
          transform = this.getTranslateFunction(55 * (i + 1) - i * 5 + 'px', direction);
        }
        this.changeElementStyle(
          button._getHostElement(),
          'transition-delay',
          transitionDelay + 'ms'
        );
        this.changeElementStyle(button._getHostElement(), 'opacity', opacity);
        this.changeElementStyle(
          button._getHostElement(),
          'transform',
          transform
        );
        this.changeElementStyle(
          button._getHostElement().parentElement,
          'max-height',
          '0'
        );
      });
    }
  }

  private getTranslateFunction(value: string, dir: string) {
    const translateFn =
      dir === 'up' || dir === 'down' ? 'translateY' : 'translateX';
    const sign = dir === 'down' || dir === 'right' ? '-' : '';
    return translateFn + '(' + sign + value + ')';
  }

  private changeElementStyle(elem: any, style: string, value: string) {
    // FIXME - Find a way to create a "wrapper" around the action button(s) provided by the user, so we don't change it's style tag
    this.renderer.setStyle(elem, style, value);
  }
}
