import { KeyValue } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Lineup, MemberOption, Module } from '@data/types';

import { LineupService } from '../lineup.service';

@Component({
  selector: 'app-lineup-options[lineup]',
  templateUrl: './lineup-options.component.html',
  styleUrls: ['./lineup-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineupOptionsComponent {
  @Input() public lineup!: Partial<Lineup>;
  @Input() public disabled = false;

  constructor(protected readonly lineupService: LineupService) {}

  protected trackByCaptain(_: number, item: MemberOption): number {
    return item.member.id; // or item.id
  }

  protected trackByModules(_: number, item: Module): string {
    return item.key; // or item.id
  }

  protected trackByCaptainField(
    _: number,
    item: KeyValue<string, 'captain_id' | 'vcaptain_id' | 'vvcaptain_id'>,
  ): string {
    return item.key; // or item.id
  }
}
