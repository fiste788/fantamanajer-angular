import { KeyValue } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  booleanAttribute,
  input,
  numberAttribute,
  inject,
} from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Subscription, finalize, firstValueFrom, from, map } from 'rxjs';

import { LineupService as LineupHttpService } from '@data/services';
import { EmptyLineup, Role } from '@data/types';
import { environment } from '@env';
import { MemberSelectionComponent } from '@modules/member/components/member-selection/member-selection.component';

import { LineupOptionsComponent } from '../lineup-options/lineup-options.component';
import { LineupService } from '../lineup.service';
import { ModuleAreaComponent } from '../module-area/module-area.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lineup-detail',
  templateUrl: './lineup-detail.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  imports: [
    LineupOptionsComponent,
    FormsModule,
    ModuleAreaComponent,
    MatCardModule,
    MemberSelectionComponent,
  ],
})
export class LineupDetailComponent implements OnInit, OnDestroy {
  readonly #lineupHttpService = inject(LineupHttpService);
  readonly #cd = inject(ChangeDetectorRef);
  readonly #subscription = new Subscription();

  public lineup = input<EmptyLineup>();
  public disabled = input(false, { transform: booleanAttribute });
  public benchs = input(environment.benchwarmersCount, { transform: numberAttribute });
  public captain = input(true, { transform: booleanAttribute });
  public jolly = input(true, { transform: booleanAttribute });

  protected readonly lineupService = inject(LineupService);

  public ngOnInit(): void {
    this.#subscription.add(from(this.loadLineup()).subscribe());
  }

  public ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }

  public getLineup(): EmptyLineup {
    return this.lineupService.getLineup();
  }

  protected async loadLineup(): Promise<void> {
    const mainLineup = this.lineup();
    if (mainLineup?.team.members?.length) {
      const lineup = this.lineupService.loadLineup(mainLineup, this.benchs());
      if (!this.disabled()) {
        return this.loadLikely(lineup);
      }
    }

    return undefined;
  }

  protected async loadLikely(lineup: EmptyLineup): Promise<void> {
    return firstValueFrom(
      this.#lineupHttpService.getLikelyLineup(lineup).pipe(
        map((members) => {
          for (const member of members) {
            const m = this.lineupService.membersById?.get(member.id);
            if (m) {
              m.likely_lineup = member.likely_lineup;
            }
          }
        }),
        finalize(() => this.#cd.detectChanges()),
      ),
      { defaultValue: undefined },
    );
  }

  protected descOrder(a: KeyValue<number, Role>, b: KeyValue<number, Role>): number {
    return Math.max(a.key, b.key);
  }
}
