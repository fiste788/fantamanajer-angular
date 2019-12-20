import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedService } from '@app/shared/services/shared.service';
import { TransfertService, MemberService } from '@app/core/services';
import { Member, Team, Transfert } from '@app/core/models';
import { ConfirmationDialogComponent } from '@app/modules/confirmation-dialog/modals/confirmation-dialog.component';

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
  newMembers: Member[];

  constructor(
    public snackBar: MatSnackBar,
    private transfertService: TransfertService,
    private changeRef: ChangeDetectorRef,
    private memberService: MemberService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.parent?.parent?.parent?.data.subscribe((data: { team: Team }) => {
      this.team = data.team;
      this.transfert.team_id = data.team.id;
      this.loadMembers(this.team);
    });
  }

  loadMembers(team: Team) {
    this.memberService.getByTeamId(team.id).subscribe(members => {
      this.team.members = members;
    });
  }

  playerChange() {
    if (this.transfert.old_member) {
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
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  submit() {
    if (this.transfertForm.valid) {
      if (this.transfert.new_member.teams.length) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            text: 'Il giocatore appartiene alla squadra ' + this.transfert.new_member.teams[0].name + '. Vuoi effettuare lo scambio?'
          },
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.save();
          }
        });
      } else {
        this.save();
      }
    }
  }

  save() {
    this.transfert.new_member_id = this.transfert.new_member.id;
    // this.transfert.new_member = undefined;
    this.transfert.old_member_id = this.transfert.old_member.id;
    // this.transfert.old_member = undefined;
    this.transfertService.create(this.transfert).subscribe(response => {
      this.snackBar.open('Trasferimento effettuato', undefined, {
        duration: 3000
      });
    },
      err => SharedService.getUnprocessableEntityErrors(this.transfertForm, err)
    );
  }

}
