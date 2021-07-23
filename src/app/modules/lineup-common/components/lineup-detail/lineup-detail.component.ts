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

import { LineupService as LineupHttpService } from '@data/services';
import { Lineup, MemberOption, Role } from '@data/types';
import { firstValueFrom, map } from 'rxjs';

import { LineupService } from '../lineup.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LineupService],
  selector: 'app-lineup-detail',
  styleUrls: ['./lineup-detail.component.scss'],
  templateUrl: './lineup-detail.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class LineupDetailComponent implements OnInit {
  @Input() public lineup?: Lineup;
  @Input() public disabled = false;

  @ViewChild(NgForm) public lineupForm: NgForm;

  constructor(
    readonly lineupService: LineupService,
    private readonly lineupHttpService: LineupHttpService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  public async ngOnInit(): Promise<void> {
    return this.loadLineup();
  }

  public async loadLineup(): Promise<void> {
    const lineup = this.lineup ?? (!this.disabled ? ({} as Lineup) : undefined);
    if (lineup !== undefined && lineup.team.members.length) {
      this.lineupService.loadLineup(lineup);
      if (!this.disabled) {
        return this.loadLikely(lineup);
      }
    }
  }

  public async loadLikely(lineup: Lineup): Promise<void> {
    return firstValueFrom(
      this.lineupHttpService.getLikelyLineup(lineup).pipe(
        map((members) => {
          members.forEach((member) => {
            const m = this.lineupService.membersById.get(member.id);
            if (m) {
              m.likely_lineup = member.likely_lineup;
            }
          });
          this.cd.detectChanges();
        }),
      ),
    );
  }

  public getLineup(): Lineup {
    return this.lineupService.getLineup();
  }

  public descOrder = (a: KeyValue<number, Role>, b: KeyValue<number, Role>): number =>
    a.key < b.key ? b.key : a.key;

  public trackByBench(_: number, item: number): number {
    return item; // or item.id
  }

  public trackByCaptain(_: number, item: MemberOption): number {
    return item.member.id; // or item.id
  }
}
