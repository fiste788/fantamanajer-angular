import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import type { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

import { combineLatest, distinctUntilChanged, filter, firstValueFrom, switchMap, tap } from 'rxjs';
import type { Observable } from 'rxjs';

import { filterNil, getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import type { Member, Role, Team, Transfer } from '@data/interfaces';
import { MemberService, RoleService, TransfertService } from '@data/services';
import { ConfirmationDialogModal } from '@modules/confirmation-dialog/components/modals/confirmation-dialog.modal';

@Component({
  imports: [AsyncPipe, FormsModule, MatButtonModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatSlideToggleModule],
  templateUrl: './new-transfert.page.html',
})
export class NewTransfertPage {

  readonly #changeRef = inject(ChangeDetectorRef);
  readonly #dialog = inject(MatDialog);
  readonly #memberService = inject(MemberService);
  readonly #roleService = inject(RoleService);
  readonly #snackbar = inject(MatSnackBar);
  readonly #transfertService = inject(TransfertService);

  protected buyMemberDisabled = false;

  protected readonly buyMembers$? = this.getNewMembers();
  protected readonly team$ = getRouteData<Team>('team');
  protected readonly sellMembers$ = this.loadMembers(this.team$);
  protected readonly transfert: Partial<Transfer> = { constrained: false };

  readonly #role = signal<Role | undefined>(undefined);
  readonly #role$ = toObservable(this.#role).pipe(distinctUntilChanged((x, y) => x?.id === y?.id));

  protected async checkMember(transfertForm: NgForm): Promise<void> {
    const team = this.transfert.new_member?.teams[0];
    if (team) {
      const dialogReference = this.#dialog.open<
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
        dialogReference.afterClosed().pipe(
          filter(r => r === true),
          switchMap(async () => this.save(transfertForm)),
        ),
        { defaultValue: undefined },
      );
    }

    return this.save(transfertForm);
  }

  protected compareFn(c1?: Member | null, c2?: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1?.id === c2?.id : c1 === c2;
  }

  protected getNewMembers(): Observable<Member[]> {
    const buyMember$ = this.#role$.pipe(
      filterNil(),
      tap(() => {
        this.buyMemberDisabled = true;
      }),
    );

    return combineLatest([buyMember$, this.team$]).pipe(
      switchMap(([role, team]) => this.#memberService.getAvailableMembersForTeam(team.id, role.id)),
      tap(() => {
        this.#changeRef.detectChanges();
        this.buyMemberDisabled = false;
      }),
    );
  }

  protected loadMembers(team$: Observable<Team>): Observable<Member[]> {
    return team$.pipe(switchMap(t => this.#memberService.getMembersByTeamId(t.id)));
  }

  protected playerChange(oldMember?: Member): void {
    if (oldMember) {
      this.#role.set(this.#roleService.getRoleById(oldMember.role_id));
    }
  }

  protected async save(transfertForm: NgForm): Promise<void> {
    this.transfert.new_member_id = this.transfert.new_member?.id;
    this.transfert.old_member_id = this.transfert.old_member?.id;

    return save(this.#transfertService.createTransfert(this.transfert), undefined, this.#snackbar, {
      form: transfertForm,
      message: 'Trasferimento effettuato',
    });
  }

  protected async submit(team: Team, transfertForm: NgForm): Promise<void> {
    if (transfertForm.valid) {
      this.transfert.team_id = team.id;

      return this.checkMember(transfertForm);
    }

    return undefined;
  }

}
