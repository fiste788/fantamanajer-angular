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
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'fm-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {
  @ViewChild(MatSelect) newMember: MatSelect;
  @ViewChild(NgForm) selectionForm: NgForm;

  selection: Selection = new Selection();
  members: Member[];
  newMembers: Member[];

  constructor(
    public snackBar: MatSnackBar,
    private teamService: TeamService,
    private selectionService: SelectionService,
    private sharedService: SharedService,
    private changeRef: ChangeDetectorRef,
    private memberService: MemberService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const team_id = this.sharedService.getTeamId(this.route);
    this.selectionService.getSelection(team_id).subscribe(selection => {
      if (selection) {
        this.selection = selection;
        this.playerChange();
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
            this.members.filter(function (value, index) {
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
        this.changeRef.detectChanges();
        this.newMember.disabled = false;
      });
  }

  compareFn(c1: Selection, c2: Selection): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  save() {
    if (this.selectionForm.valid) {
      const selection = new Selection();
      if (this.selection.id) {
        selection.id = this.selection.id;
      }
      selection.new_member_id = this.selection.new_member.id;
      selection.old_member_id = this.selection.old_member.id;
      selection.team_id = this.sharedService.currentTeam.id;
      let obs = null;
      if (selection.id) {
        obs = this.selectionService.update(selection);
      } else {
        obs = this.selectionService.create(selection);
      }
      obs.subscribe(response => {
        this.snackBar.open('Selezione salvata correttamente', null, {
          duration: 3000
        });
      },
        err => this.sharedService.getUnprocessableEntityErrors(this.selectionForm, err)
      );
    }
  }
}
