import { KeyValue, NgIf, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  booleanAttribute,
  input,
  numberAttribute,
} from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Subscription, finalize, firstValueFrom, from, map } from 'rxjs';

import { addVisibleClassOnDestroy } from '@app/functions';
import { LineupService as LineupHttpService } from '@data/services';
import { EmptyLineup, Role } from '@data/types';
import { environment } from '@env';
import { MemberSelectionComponent } from '@modules/member-common/components/member-selection/member-selection.component';
import { cardCreationAnimation } from '@shared/animations';

import { LineupOptionsComponent } from '../lineup-options/lineup-options.component';
import { LineupService } from '../lineup.service';
import { ModuleAreaComponent } from '../module-area/module-area.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [LineupService],
  selector: 'app-lineup-detail',
  styleUrl: './lineup-detail.component.scss',
  templateUrl: './lineup-detail.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  animations: [cardCreationAnimation],
  standalone: true,
  imports: [
    NgIf,
    LineupOptionsComponent,
    FormsModule,
    ModuleAreaComponent,
    MatCardModule,
    NgFor,
    MemberSelectionComponent,
  ],
})
export class LineupDetailComponent implements OnInit, OnDestroy {
  public lineup = input<EmptyLineup>();
  public disabled = input(false, { transform: booleanAttribute });
  public benchs = input(environment.benchwarmersCount, { transform: numberAttribute });

  private readonly subscription = new Subscription();

  constructor(
    protected readonly lineupService: LineupService,
    private readonly lineupHttpService: LineupHttpService,
    private readonly cd: ChangeDetectorRef,
  ) {
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  public ngOnInit(): void {
    this.subscription.add(from(this.loadLineup()).subscribe());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      this.lineupHttpService.getLikelyLineup(lineup).pipe(
        map((members) => {
          for (const member of members) {
            const m = this.lineupService.membersById?.get(member.id);
            if (m) {
              m.likely_lineup = member.likely_lineup;
            }
          }
        }),
        finalize(() => this.cd.detectChanges()),
      ),
      { defaultValue: undefined },
    );
  }

  protected descOrder(a: KeyValue<number, Role>, b: KeyValue<number, Role>): number {
    return a.key < b.key ? b.key : a.key;
  }
}
