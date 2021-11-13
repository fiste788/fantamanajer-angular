import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { UtilService } from '@app/services';
import { MemberService, TransfertService } from '@data/services';
import { Member, Team, Transfert } from '@data/types';
import { ConfirmationDialogModal } from '@modules/confirmation-dialog/modals/confirmation-dialog.modal';

@Component({
  styleUrls: ['./new-transfert.page.scss'],
  templateUrl: './new-transfert.page.html',
})
export class NewTransfertPage {
  @ViewChild(NgForm) public transfertForm?: NgForm;

  public transfert: Partial<Transfert> = {};
  public team$: Observable<Team>;
  public oldMembers$: Observable<Array<Member>>;
  public newMemberDisabled = false;
  public newMembers$?: Observable<Array<Member>>;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly transfertService: TransfertService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
  ) {
    this.team$ = UtilService.getData<Team>(this.route, 'team');
    this.oldMembers$ = this.loadMembers(this.team$);
  }

  public loadMembers(team$: Observable<Team>): Observable<Array<Member>> {
    return team$.pipe(switchMap((t) => this.memberService.getByTeamId(t.id)));
  }

  public playerChange(team: Team, oldMember?: Member): void {
    if (oldMember) {
      this.newMemberDisabled = true;
      this.newMembers$ = this.memberService.getNotMine(team.id, oldMember.role_id).pipe(
        tap(() => {
          this.changeRef.detectChanges();
          this.newMemberDisabled = false;
        }),
      );
    }
  }

  public compareFn(c1: Member | null, c2: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  public async submit(team: Team): Promise<void> {
    if (this.transfertForm?.valid) {
      this.transfert.team_id = team.id;
      return firstValueFrom(this.checkMember(), { defaultValue: undefined });
    }
  }

  public checkMember(): Observable<void> {
    if (this.transfert.new_member?.teams.length) {
      const dialogRef = this.dialog.open<ConfirmationDialogModal, { text: string }, boolean>(
        ConfirmationDialogModal,
        {
          data: {
            text: `Il giocatore appartiene alla squadra ${this.transfert.new_member.teams[0].name}. Vuoi effettuare lo scambio?`,
          },
        },
      );
      return dialogRef.afterClosed().pipe(
        filter((r) => r === true),
        switchMap(() => this.save()),
      );
    } else {
      return this.save();
    }
  }

  public save(): Observable<void> {
    this.transfert.new_member_id = this.transfert.new_member?.id;
    // this.transfert.new_member = undefined;
    this.transfert.old_member_id = this.transfert.old_member?.id;
    // this.transfert.old_member = undefined;
    return this.transfertService.create(this.transfert).pipe(
      map(() => {
        this.snackBar.open('Trasferimento effettuato', undefined, {
          duration: 3000,
        });
      }),
      catchError((err: unknown) =>
        UtilService.getUnprocessableEntityErrors(err, this.transfertForm),
      ),
    );
  }

  public track(_: number, item: Member): number {
    return item.id; // or item.id
  }
}
