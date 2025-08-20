import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  combineLatest,
  firstValueFrom,
  Observable,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';

import { filterNil, getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import { MemberService, RoleService, TransfertService } from '@data/services';
import { Member, Role, Team, Transfer } from '@data/types';
import { ConfirmationDialogModal } from '@modules/confirmation-dialog/modals/confirmation-dialog.modal';

@Component({
  templateUrl: './new-transfert.page.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class NewTransfertPage {
  readonly #transfertService = inject(TransfertService);
  readonly #roleService = inject(RoleService);
  readonly #changeRef = inject(ChangeDetectorRef);
  readonly #memberService = inject(MemberService);
  readonly #dialog = inject(MatDialog);
  readonly #snackbar = inject(MatSnackBar);
  readonly #role = signal<Role | undefined>(undefined);
  readonly #role$ = toObservable(this.#role).pipe(distinctUntilChanged((x, y) => x?.id === y?.id));

  protected readonly transfert: Partial<Transfer> = { constrained: false };
  protected readonly team$ = getRouteData<Team>('team');
  protected readonly oldMembers$ = this.loadMembers(this.team$);
  protected readonly newMembers$? = this.getNewMembers();
  protected newMemberDisabled = false;

  protected loadMembers(team$: Observable<Team>): Observable<Array<Member>> {
    return team$.pipe(switchMap((t) => this.#memberService.getMembersByTeamId(t.id)));
  }

  protected getNewMembers(): Observable<Array<Member>> {
    const newMember$ = this.#role$.pipe(
      filterNil(),
      tap(() => {
        this.newMemberDisabled = true;
      }),
    );

    return combineLatest([newMember$, this.team$]).pipe(
      switchMap(([role, team]) => this.#memberService.getAvailableMembersForTeam(team.id, role.id)),
      tap(() => {
        this.#changeRef.detectChanges();
        this.newMemberDisabled = false;
      }),
    );
  }

  protected playerChange(oldMember?: Member): void {
    if (oldMember) {
      this.#role.set(this.#roleService.getRoleById(oldMember.role_id));
    }
  }

  protected compareFn(c1?: Member | null, c2?: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1?.id === c2?.id : c1 === c2;
  }

  protected async submit(team: Team, transfertForm: NgForm): Promise<void> {
    if (transfertForm.valid) {
      this.transfert.team_id = team.id;

      return this.checkMember(transfertForm);
    }

    return undefined;
  }

  protected async checkMember(transfertForm: NgForm): Promise<void> {
    const team = this.transfert.new_member?.teams[0];
    if (team) {
      const dialogRef = this.#dialog.open<
        ConfirmationDialogModal,
        {
          text: string;
        },
        boolean
      >(ConfirmationDialogModal, {
        data: {
          text: `Il giocatore appartiene alla squadra ${team.name}. Vuoi effettuare lo scambio?`,
        },
      });

      return firstValueFrom(
        dialogRef.afterClosed().pipe(
          filter((r) => r === true),
          switchMap(async () => this.save(transfertForm)),
        ),
        { defaultValue: undefined },
      );
    }

    return this.save(transfertForm);
  }

  protected async save(transfertForm: NgForm): Promise<void> {
    this.transfert.new_member_id = this.transfert.new_member?.id;
    this.transfert.old_member_id = this.transfert.old_member?.id;

    return save(this.#transfertService.createTransfert(this.transfert), undefined, this.#snackbar, {
      message: 'Trasferimento effettuato',
      form: transfertForm,
    });
  }
}
