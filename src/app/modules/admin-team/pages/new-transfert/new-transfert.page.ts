import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { getRouteData, getUnprocessableEntityErrors } from '@app/functions';
import { MemberService, TransfertService } from '@data/services';
import { Member, Team, Transfert } from '@data/types';
import { ConfirmationDialogModal } from '@modules/confirmation-dialog/modals/confirmation-dialog.modal';

@Component({
  styleUrls: ['./new-transfert.page.scss'],
  templateUrl: './new-transfert.page.html',
})
export class NewTransfertPage {
  @ViewChild(NgForm) public transfertForm?: NgForm;

  protected readonly transfert: Partial<Transfert> = {};
  protected readonly team$: Observable<Team>;
  protected readonly oldMembers$: Observable<Array<Member>>;
  protected newMemberDisabled = false;
  protected newMembers$?: Observable<Array<Member>>;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly transfertService: TransfertService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly dialog: MatDialog,
  ) {
    this.team$ = getRouteData<Team>('team');
    this.oldMembers$ = this.loadMembers(this.team$);
  }

  protected loadMembers(team$: Observable<Team>): Observable<Array<Member>> {
    return team$.pipe(switchMap((t) => this.memberService.getByTeamId(t.id)));
  }

  protected playerChange(team: Team, oldMember?: Member): void {
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

  protected compareFn(c1: Member | null, c2: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  protected async submit(team: Team): Promise<void> {
    if (this.transfertForm?.valid) {
      this.transfert.team_id = team.id;

      return firstValueFrom(this.checkMember(), { defaultValue: undefined });
    }

    return undefined;
  }

  protected checkMember(): Observable<void> {
    const team = this.transfert.new_member?.teams[0];
    if (team) {
      const dialogRef = this.dialog.open<ConfirmationDialogModal, { text: string }, boolean>(
        ConfirmationDialogModal,
        {
          data: {
            text: `Il giocatore appartiene alla squadra ${team.name}. Vuoi effettuare lo scambio?`,
          },
        },
      );

      return dialogRef.afterClosed().pipe(
        filter((r) => r === true),
        switchMap(() => this.save()),
      );
    }

    return this.save();
  }

  protected save(): Observable<void> {
    this.transfert.new_member_id = this.transfert.new_member?.id;
    // this.transfert.new_member = undefined;
    this.transfert.old_member_id = this.transfert.old_member?.id;

    // this.transfert.old_member = undefined;
    return this.transfertService.create(this.transfert).pipe(
      map(() => {
        this.snackBar.open('Trasferimento effettuato');
      }),
      catchError((err: unknown) => getUnprocessableEntityErrors(err, this.transfertForm)),
    );
  }

  protected track(_: number, item: Member): number {
    return item.id; // or item.id
  }
}
