import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable } from 'rxjs';
import { distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { filterNil, getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import { MemberService, RoleService, TransfertService } from '@data/services';
import { Member, Role, Team, Transfert } from '@data/types';
import { ConfirmationDialogModal } from '@modules/confirmation-dialog/modals/confirmation-dialog.modal';

@Component({
  styleUrls: ['./new-transfert.page.scss'],
  templateUrl: './new-transfert.page.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatSlideToggleModule,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class NewTransfertPage {
  @ViewChild(NgForm) public transfertForm?: NgForm;

  protected readonly transfert: Partial<Transfert> = { constrained: false };
  protected readonly team$: Observable<Team>;
  protected readonly oldMembers$: Observable<Array<Member>>;
  protected readonly newMembers$?: Observable<Array<Member>>;
  protected newMemberDisabled = false;

  private readonly roleSubject$: BehaviorSubject<Role | undefined> = new BehaviorSubject<
    Role | undefined
  >(undefined);

  private readonly role$: Observable<Role | undefined>;

  constructor(
    private readonly transfertService: TransfertService,
    private readonly roleService: RoleService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
  ) {
    this.team$ = getRouteData<Team>('team');
    this.oldMembers$ = this.loadMembers(this.team$);
    this.role$ = this.roleSubject$.pipe(distinctUntilChanged((x, y) => x?.id === y?.id));
    this.newMembers$ = this.getNewMembers();
  }

  protected loadMembers(team$: Observable<Team>): Observable<Array<Member>> {
    return team$.pipe(switchMap((t) => this.memberService.getByTeamId(t.id)));
  }

  protected getNewMembers(): Observable<Array<Member>> {
    const newMember$ = this.role$.pipe(
      filterNil(),
      tap(() => {
        this.newMemberDisabled = true;
      }),
    );

    return combineLatest([newMember$, this.team$]).pipe(
      switchMap(([role, team]) => this.memberService.getNotMine(team.id, role.id)),
      tap(() => {
        this.changeRef.detectChanges();
        this.newMemberDisabled = false;
      }),
    );
  }

  protected playerChange(oldMember?: Member): void {
    if (oldMember) {
      this.roleSubject$.next(this.roleService.get(oldMember.role_id));
    }
  }

  protected compareFn(c1: Member | null, c2: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1.id === c2.id : c1 === c2;
  }

  protected async submit(team: Team): Promise<void> {
    if (this.transfertForm?.valid) {
      this.transfert.team_id = team.id;

      return this.checkMember();
    }

    return undefined;
  }

  protected async checkMember(): Promise<void> {
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

      return firstValueFrom(
        dialogRef.afterClosed().pipe(
          filter((r) => r === true),
          switchMap(async () => this.save()),
        ),
        { defaultValue: undefined },
      );
    }

    return this.save();
  }

  protected async save(): Promise<void> {
    this.transfert.new_member_id = this.transfert.new_member?.id;
    this.transfert.old_member_id = this.transfert.old_member?.id;

    return save(this.transfertService.create(this.transfert), undefined, this.snackbar, {
      message: 'Trasferimento effettuato',
      form: this.transfertForm,
    });
  }

  protected track(_: number, item: Member): number {
    return item.id; // or item.id
  }
}
