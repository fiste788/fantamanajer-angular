import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelect } from '@angular/material';
import { Selection } from '../selection';
import { Member } from '../../member/member';
import { TeamService } from '../../team/team.service';
import { SelectionService } from '../selection.service';
import { MemberService } from '../../member/member.service';
import { SharedService } from '../../shared/shared.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'fm-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {
  @ViewChild(MatSelect) newMember: MatSelect;

  selection: Selection = new Selection();
  members: Member[];
  newMembers: Member[];

  constructor(
    private teamService: TeamService,
    private selectionService: SelectionService,
    private sharedService: SharedService,
    private changeRef: ChangeDetectorRef,
    private memberService: MemberService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const team_id = this.getTeamId();
    this.selectionService.getSelection(team_id).subscribe(selection => {
      console.log(selection);
      if (selection) {
        this.selection = selection;
        this.changeRef.detectChanges();
      }
    });
    this.teamService.getTeam(team_id).subscribe(team => {
      this.members = team.members;
      const buyingMember = localStorage.getItem('buyingMember');
      if (buyingMember) {
        localStorage.removeItem('buyingMember');
        const member = JSON.parse(buyingMember);
        this.memberService
          .getFree(this.sharedService.currentChampionship.id, member.role_id)
          .subscribe(members => {
            this.newMembers = members;
            this.selection.new_member = member;
            this.selection.new_member_id = member.id;
            this.newMember.disabled = false;
            this.members.filter(function(value, index) {
              return value.role_id === member.role_id;
            });
            this.changeRef.detectChanges();
          });
      }
    });
  }

  playerChange() {
    this.newMember.disabled = true;
    this.memberService
      .getFree(
        this.sharedService.currentChampionship.id,
        this.selection.old_member.role_id
      )
      .subscribe(members => {
        this.newMembers = members;
        console.log(this.newMembers);
        this.changeRef.detectChanges();
        this.newMember.disabled = false;
      });
  }

  compareFn(c1: Selection, c2: Selection): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  save() {
    const selection = new Selection();
    selection.id = this.selection.id;
    selection.new_member_id = this.selection.new_member.id;
    selection.old_member_id = this.selection.old_member.id;
    selection.team_id = this.sharedService.currentTeam.id;
    if (this.selection.id) {
      this.selectionService.update(selection);
    } else {
      this.selectionService.create(selection);
    }
  }

  getTeamId(): number {
    for (const x in this.route.snapshot.pathFromRoot) {
      if (this.route.pathFromRoot.hasOwnProperty(x)) {
        const current = this.route.snapshot.pathFromRoot[x];
        if (current.params.hasOwnProperty('team_id')) {
          return parseInt(current.params['team_id'], 10);
        }
      }
    }
  }
}
