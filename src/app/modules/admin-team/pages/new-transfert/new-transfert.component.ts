import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { MemberService, TransfertService } from '@app/http';
import { UtilService } from '@app/services';
import { ConfirmationDialogComponent } from '@modules/confirmation-dialog/modals/confirmation-dialog.component';
import { Member, Team, Transfert } from '@shared/models';

@Component({
  selector: 'fm-new-transfert',
  templateUrl: './new-transfert.component.html',
  styleUrls: ['./new-transfert.component.scss']
})
export class NewTransfertComponent implements OnInit {
  @ViewChild(MatSelect) newMember: MatSelect;
  @ViewChild(NgForm) transfertForm: NgForm;

  transfert: Transfert = new Transfert();
  team: Team;
  newMembers: Array<Member>;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly transfertService: TransfertService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const team = UtilService.getSnapshotData<Team>(this.route, 'team');
    if (team) {
      this.team = team;
      this.transfert.team_id = team.id;
      this.loadMembers(this.team);
    }
  }

  loadMembers(team: Team): void {
    this.memberService.getByTeamId(team.id)
      .subscribe(members => {
        this.team.members = members;
      });
  }

  playerChange(): void {
    if (this.transfert.old_member !== undefined) {
      this.newMember.disabled = true;
      this.memberService.getNotMine(this.team.id, this.transfert.old_member.role_id)
        .subscribe(members => {
          this.newMembers = members;
          this.changeRef.detectChanges();
          this.newMember.disabled = false;
        });
    }
  }

  compareFn(c1: Member, c2: Member): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  submit(): void {
    if (this.transfertForm.valid === true) {
      if (this.transfert.new_member.teams.length) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            text: `Il giocatore appartiene alla squadra ${this.transfert.new_member.teams[0].name}. Vuoi effettuare lo scambio?`
          }
        });
        dialogRef.afterClosed()
          .subscribe(result => {
            if (result) {
              this.save();
            }
          });
      } else {
        this.save();
      }
    }
  }

  save(): void {
    this.transfert.new_member_id = this.transfert.new_member.id;
    // this.transfert.new_member = undefined;
    this.transfert.old_member_id = this.transfert.old_member.id;
    // this.transfert.old_member = undefined;
    this.transfertService.create(this.transfert)
      .subscribe(() => {
        this.snackBar.open('Trasferimento effettuato', undefined, {
          duration: 3000
        });
      },
        err => {
          UtilService.getUnprocessableEntityErrors(this.transfertForm, err);
        }
      );
  }

  track(_: number, item: Transfert): number {
    return item.id; // or item.id
  }

}
