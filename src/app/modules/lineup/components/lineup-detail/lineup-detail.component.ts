import { animate, style, transition, trigger } from '@angular/animations';
import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { LineupService as LineupHttpService, RoleService } from '@app/http';
import { MemberOption } from '@modules/member-common/components/member-selection/member-selection.component';
import { Lineup, Member, Module, Role } from '@shared/models';

import { Area, LineupService } from '../lineup.service';

@Component({
  selector: 'fm-lineup-detail',
  templateUrl: './lineup-detail.component.html',
  styleUrls: ['./lineup-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LineupService],
  animations: [
    // transition(':leave', animateChild()),
    trigger('items', [
      transition(':enter', [
        style({ flex: 0.00001 }),  // initial
        animate('500ms ease',
          style({ flex: 1 }))  // final
      ]),
      transition(':leave', [
        style({ flex: 1 }),
        animate('500ms ease',
          style({
            flex: 0.00001
          }))
      ])
    ])
  ]
})
export class LineupDetailComponent implements OnInit {
  @Input() lineup?: Lineup;
  @Input() disabled = false;

  @ViewChild(NgForm) lineupForm: NgForm;

  modules: Array<Module>;

  constructor(
    readonly lineupService: LineupService,
    private readonly lineupHttpService: LineupHttpService,
    private readonly roleService: RoleService,
    private readonly cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadLineup();
  }

  loadLineup(): void {
    const lineup = this.lineup ?? ((!this.disabled) ? new Lineup(this.roleService.list()) : undefined);
    if (lineup !== undefined && lineup.team.members !== undefined) {
      this.lineupService.loadLineup(lineup);
      if (!this.disabled) {
        this.loadLikely(lineup);
      }
      this.loadModules(lineup);
    }
  }

  loadLikely(lineup: Lineup): void {
    this.lineupHttpService.getLikelyLineup(lineup)
      .subscribe(members => {
        members.forEach(member => {
          const m = this.lineupService.membersById.get(member.id);
          if (m) {
            m.likely_lineup = member.likely_lineup;
          }
        });
        this.cd.detectChanges();
      });
  }

  loadModules(lineup: Lineup): void {
    this.modules = lineup.modules.map(mod => new Module(mod, this.roleService.list()));
    if (lineup.module) {
      lineup.module_object = this.modules.find(e => e.key === lineup.module, this);
      this.lineupService.changeModule(lineup);
    }
  }

  descOrder = (a: KeyValue<number, Role>, b: KeyValue<number, Role>) =>
    (a.key < b.key) ? b.key : a.key;

  trackByArea(_: number, item: Area): number {
    return item.role.id; // or item.id
  }

  trackBySelection(_: number, item: KeyValue<number, Role>): number {
    return item.key; // or item.id
  }

  trackByBench(_: number, item: number): number {
    return item; // or item.id
  }

  trackByMember(_: number, item: Member): number {
    return item.id; // or item.id
  }

  trackByCaptain(_: number, item: MemberOption): number {
    return item.member.id; // or item.id
  }
}
