import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { ApplicationService } from '@app/services';
import { map, Subscription } from 'rxjs';

@Directive({
  selector: '[appSeasonActive]',
})
export class SeasonActiveDirective implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef,
    private readonly app: ApplicationService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.app.team$.pipe(map((t) => t !== undefined)).subscribe((t) => {
        if (t && this.app.seasonStarted && !this.app.seasonEnded) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
