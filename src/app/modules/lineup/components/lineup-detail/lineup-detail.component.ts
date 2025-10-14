import { KeyValue } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  booleanAttribute,
  input,
  numberAttribute,
  inject,
} from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { finalize, firstValueFrom, map } from 'rxjs';

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
export class LineupDetailComponent {
  readonly #lineupHttpService = inject(LineupHttpService);
  readonly #cd = inject(ChangeDetectorRef);

  public lineup = input<EmptyLineup | undefined, EmptyLineup | undefined>(undefined, {
    transform: (lineup?: EmptyLineup) => this.loadLineup(lineup),
  });
  public disabled = input(false, { transform: booleanAttribute });
  public benchs = input(environment.benchwarmersCount, { transform: numberAttribute });
  public captain = input(true, { transform: booleanAttribute });
  public jolly = input(true, { transform: booleanAttribute });

  protected readonly lineupService = inject(LineupService);

  public getLineup(): EmptyLineup {
    return this.lineupService.getLineup();
  }

  protected loadLineup(lineup?: EmptyLineup): EmptyLineup | undefined {
    if (lineup?.team.members?.length) {
      this.lineupService.loadLineup(lineup, this.benchs());
      if (!this.disabled()) {
        void this.loadLikely(lineup);
      }
    }

    return lineup;
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
