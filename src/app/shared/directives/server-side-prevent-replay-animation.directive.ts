import { isPlatformServer } from '@angular/common';
import {
  Directive,
  ElementRef,
  inject,
  makeStateKey,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  TransferState,
  OnDestroy,
} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription, tap } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[appSsrPreventAnimationReplay]',
})
export class ServerSidePreventAnimationReplayDirective implements OnInit, OnDestroy {
  public static key = makeStateKey<{ url: string }>('ssrPreventAnimationReplay');
  public static subscription?: Subscription;

  readonly #el = inject(ElementRef);
  readonly #transferState = inject(TransferState);
  readonly #router = inject(Router);
  readonly #renderer = inject(Renderer2);
  readonly #platformId = inject(PLATFORM_ID);

  public ngOnInit(): void {
    if (isPlatformServer(this.#platformId))
      this.#transferState.set(ServerSidePreventAnimationReplayDirective.key, {
        url: this.#router.url,
      });
    else {
      const value = this.#transferState.get(
        ServerSidePreventAnimationReplayDirective.key,
        // eslint-disable-next-line unicorn/no-useless-undefined
        undefined,
      );
      if (value && value.url === this.#router.url) {
        this.#preventAnimation();
        this.#cancelOnNavigation();
      }
    }
  }

  public ngOnDestroy(): void {
    if (ServerSidePreventAnimationReplayDirective.subscription)
      ServerSidePreventAnimationReplayDirective.subscription.unsubscribe();
  }

  #preventAnimation() {
    this.#renderer.setStyle(this.#el.nativeElement, 'animation-duration', '0ms');
    this.#renderer.setStyle(this.#el.nativeElement, 'animation-delay', '0ms');
  }

  #cancelOnNavigation() {
    ServerSidePreventAnimationReplayDirective.subscription = this.#router.events
      .pipe(
        tap((event) => {
          if (event instanceof NavigationStart) {
            this.#transferState.remove(ServerSidePreventAnimationReplayDirective.key);
          }
        }),
      )
      .subscribe();
  }
}
