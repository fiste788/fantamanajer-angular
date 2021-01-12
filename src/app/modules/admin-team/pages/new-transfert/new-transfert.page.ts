import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { MemberService, TransfertService } from '@data/services';
import { UtilService } from '@app/services';
import { ConfirmationDialogModal } from '@modules/confirmation-dialog/modals/confirmation-dialog.modal';
import { Member, Team, Transfert } from '@data/types';

@Component({
  styleUrls: ['./new-transfert.page.scss'],
  templateUrl: './new-transfert.page.html',
})
export class NewTransfertPage implements OnInit {
  @ViewChild(MatSelect) public newMember: MatSelect;
  @ViewChild(NgForm) public transfertForm: NgForm;

  public transfert: Partial<Transfert> = new Transfert();
  public team: Team;
  public newMembers: Array<Member>;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly transfertService: TransfertService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    const team = UtilService.getSnapshotData<Team>(this.route, 'team');
    if (team) {
      this.team = team;
      this.transfert.team_id = team.id;
      this.loadMembers(this.team);
    }
  }

  public loadMembers(team: Team): void {
    this.memberService.getByTeamId(team.id).subscribe((members) => {
      this.team.members = members;
    });
  }

  public playerChange(): void {
    if (this.transfert.old_member !== undefined) {
      this.newMember.disabled = true;
      this.memberService
        .getNotMine(this.team.id, this.transfert.old_member.role_id)
        .subscribe((members) => {
          this.newMembers = members;
          this.changeRef.detectChanges();
          this.newMember.disabled = false;
        });
    }
  }

  public compareFn(c1: Member | null, c2: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  public submit(): void {
    if (this.transfertForm.valid === true) {
      if (this.transfert.new_member?.teams.length) {
        const dialogRef = this.dialog.open<ConfirmationDialogModal, { text: string }, boolean>(
          ConfirmationDialogModal,
          {
            data: {
              text: `Il giocatore appartiene alla squadra ${this.transfert.new_member.teams[0].name}. Vuoi effettuare lo scambio?`,
            },
          },
        );
        dialogRef
          .afterClosed()
          .pipe(filter((r) => r === true))
          .subscribe(() => {
            this.save();
          });
      } else {
        this.save();
      }
    }
  }

  public save(): void {
    this.transfert.new_member_id = this.transfert.new_member?.id;
    // this.transfert.new_member = undefined;
    this.transfert.old_member_id = this.transfert.old_member?.id;
    // this.transfert.old_member = undefined;
    this.transfertService.create(this.transfert).subscribe(
      () => {
        this.snackBar.open('Trasferimento effettuato', undefined, {
          duration: 3000,
        });
      },
      (err) => {
        UtilService.getUnprocessableEntityErrors(this.transfertForm, err);
      },
    );
  }

  public track(_: number, item: Member): number {
    return item.id; // or item.id
  }
}
