import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription, first } from 'rxjs';

import { ApplicationService } from '@app/services';

@Directive({
  selector: '[appSeasonActive]',
  standalone: true,
})
export class SeasonActiveDirective implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef,
    private readonly app: ApplicationService,
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.app.requireTeam$.pipe(first()).subscribe(() => {
        if (this.app.seasonStarted && !this.app.seasonEnded) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
