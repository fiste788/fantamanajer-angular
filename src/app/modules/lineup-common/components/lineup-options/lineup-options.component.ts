import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Lineup, MemberOption } from '@data/types';
import { LineupService } from '../lineup.service';

@Component({
  selector: 'app-lineup-options',
  templateUrl: './lineup-options.component.html',
  styleUrls: ['./lineup-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineupOptionsComponent {
  @Input() public lineup: Partial<Lineup>;
  @Input() public disabled = false;

  constructor(readonly lineupService: LineupService) {}

  public trackByCaptain(_: number, item: MemberOption): number {
    return item.member.id; // or item.id
  }
}
