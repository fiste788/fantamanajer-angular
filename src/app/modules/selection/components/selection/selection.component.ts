import { AsyncPipe, KeyValue, KeyValuePipe } from '@angular/common';
import { Component, viewChild, inject, signal, linkedSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, map, switchMap } from 'rxjs';

import { filterNil, getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import { ApplicationService } from '@app/services';
import { AtLeast } from '@app/types';
import { MemberService, RoleService, SelectionService } from '@data/services';
import { Member, Role, Selection, Team } from '@data/types';

@Component({
  selector: 'app-selection',
  imports: [
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    AsyncPipe,
    KeyValuePipe,
  ],
  styleUrl: './selection.component.scss',
  templateUrl: './selection.component.html',
})
export class SelectionComponent {
  readonly #selectionService = inject(SelectionService);
  readonly #app = inject(ApplicationService);
  readonly #roleService = inject(RoleService);
  readonly #memberService = inject(MemberService);
  readonly #route = inject(ActivatedRoute);
  readonly #snackbar = inject(MatSnackBar);

  #savedSelection?: Selection;
  protected readonly data$ = this.loadData();
  protected readonly selectedMember = toSignal(this.getSelectedMember(), {
    initialValue: undefined,
  });
  protected readonly newMember = linkedSignal(() => this.selectedMember());
  protected readonly oldMember = signal<Member | undefined>(undefined);
  protected readonly role$ = toObservable(
    linkedSignal<Role | undefined>(() => this.oldMember()?.role),
  );

  protected selectionForm = viewChild(NgForm);
  protected newMembers$ = this.role$.pipe(
    filterNil(),
    switchMap((role) =>
      this.#memberService.getFree(this.#app.team()!.championship.id, role.id, false),
    ),
  );

  protected loadData(): Observable<{
    selection: Selection;
    members: Map<Role, Array<Member>>;
  }> {
    return getRouteData<Team>('team').pipe(
      filterNil(),
      switchMap((team) => this.loadTeamData(team)),
    );
  }

  protected loadTeamData(team: Team): Observable<{
    selection: Selection;
    members: Map<Role, Array<Member>>;
  }> {
    return forkJoin({
      members: this.getTeamMembers(team),
      selection: this.#selectionService.getLastOrNewSelection(team.id),
    }).pipe(
      map(({ members, selection }) => {
        if (selection.id) {
          this.#savedSelection = Object.freeze(selection);
        }
        const selectedMember = this.selectedMember();
        if (selectedMember && selection.old_member?.role_id !== selectedMember.role_id) {
          // eslint-disable-next-line unicorn/no-null
          selection.old_member = null;
        }
        this.newMember.set(selection.new_member ?? undefined);
        this.oldMember.set(selection.old_member ?? undefined);

        return { selection, members };
      }),
    );
  }

  protected getTeamMembers(team: Team): Observable<Map<Role, Array<Member>>> {
    return this.#memberService
      .getByTeamId(team.id)
      .pipe(map((data) => this.#roleService.groupMembersByRole(data)));
  }

  protected getSelectedMember(): Observable<Member> {
    return this.#route.queryParamMap.pipe(
      map((params) => params.get('new_member_id')),
      filterNil(),
      switchMap((id) => this.#memberService.getById(+id)),
    );
  }

  protected compareFn(c1: Member | null, c2: Member | null): boolean {
    return c1?.id === c2?.id;
  }

  protected async save(selection: Partial<Selection>): Promise<void> {
    if (this.selectionForm()?.valid) {
      const team = this.#app.requireTeam();

      selection.team_id = team.id;
      selection.old_member_id = selection.old_member?.id ?? 0;
      selection.new_member_id = selection.new_member?.id ?? 0;
      delete selection.team;
      if (this.#savedSelection?.new_member_id !== selection.new_member_id) {
        delete selection.id;
      }
      const save$ = selection.id
        ? this.#selectionService.update(selection as Selection)
        : this.#selectionService.create(selection as AtLeast<Selection, 'team_id'>);

      return save(save$, undefined, this.#snackbar, {
        message: 'Selezione salvata correttamento',
        callback: (res: Partial<Selection>) => {
          if (res.id) {
            selection.id = res.id;
          }
        },
        form: this.selectionForm(),
      });
    }

    return undefined;
  }

  protected descOrder(a: KeyValue<Role, Array<Member>>, b: KeyValue<Role, Array<Member>>): number {
    return Math.max(a.key.id, b.key.id);
  }
}
