import type { KeyValue } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, numberAttribute } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { finalize, firstValueFrom, map } from 'rxjs';

import { ENVIRONMENT } from '@env';

import type { EmptyLineup, Role } from '@data/interfaces';
import { LineupService as LineupHttpService } from '@data/services';
import { MemberSelectionComponent } from '@modules/member/components/member-selection/member-selection.component';

import { LineupOptionsComponent } from '../lineup-options/lineup-options.component';
import { LineupService } from '../lineup.service';
import { ModuleAreaComponent } from '../module-area/module-area.component';

@Component({
  selector: 'app-lineup-detail',
  imports: [FormsModule, LineupOptionsComponent, MatCardModule, MemberSelectionComponent, ModuleAreaComponent],
  templateUrl: './lineup-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class LineupDetailComponent {

  readonly #cd = inject(ChangeDetectorRef);
  readonly #lineupHttpService = inject(LineupHttpService);
  protected readonly lineupService = inject(LineupService);

  public readonly benchs = input(ENVIRONMENT.benchwarmersCount, { transform: numberAttribute });
  public readonly captain = input(true, { transform: booleanAttribute });
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly jolly = input(true, { transform: booleanAttribute });
  public readonly lineup = input<EmptyLineup | undefined, EmptyLineup | undefined>(undefined, {
    transform: (lineup?: EmptyLineup) => this.loadLineup(lineup),
  });

  public getLineup(): EmptyLineup {
    return this.lineupService.getLineup();
  }

  protected descOrder(a: KeyValue<number, Role>, b: KeyValue<number, Role>): number {
    return Math.max(a.key, b.key);
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

  protected loadLineup(lineup?: EmptyLineup): EmptyLineup | undefined {
    if (lineup?.team.members?.length) {
      this.lineupService.loadLineup(lineup, this.benchs());
      if (!this.disabled()) {
        void this.loadLikely(lineup);
      }
    }

    return lineup;
  }

}
