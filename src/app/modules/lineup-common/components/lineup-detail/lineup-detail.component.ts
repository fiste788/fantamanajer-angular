import { KeyValue } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { finalize, firstValueFrom, map } from 'rxjs';

import { LineupService as LineupHttpService } from '@data/services';
import { EmptyLineup, Role } from '@data/types';
import { environment } from '@env';
import { cardCreationAnimation } from '@shared/animations';

import { LineupService } from '../lineup.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LineupService],
  selector: 'app-lineup-detail',
  styleUrls: ['./lineup-detail.component.scss'],
  templateUrl: './lineup-detail.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  animations: [cardCreationAnimation],
})
export class LineupDetailComponent implements OnInit {
  @Input() public lineup?: EmptyLineup;
  @Input() public disabled = false;
  @Input() public benchs = environment.benchwarmersCount;

  @ViewChild(NgForm) protected lineupForm?: NgForm;

  constructor(
    protected readonly lineupService: LineupService,
    private readonly lineupHttpService: LineupHttpService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  public async ngOnInit(): Promise<void> {
    return this.loadLineup();
  }

  public getLineup(): EmptyLineup {
    return this.lineupService.getLineup();
  }

  protected async loadLineup(): Promise<void> {
    if (this.lineup?.team.members.length) {
      const lineup = this.lineupService.loadLineup(this.lineup, this.benchs);
      if (!this.disabled) {
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

  protected trackByBench(_: number, item: number): number {
    return item; // or item.id
  }
}
