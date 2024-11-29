import { AsyncPipe, KeyValue, KeyValuePipe } from '@angular/common';
import { ChangeDetectorRef, Component, viewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  Observable,
  of,
  distinctUntilChanged,
  first,
  map,
  switchMap,
  tap,
} from 'rxjs';

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
  readonly #changeRef = inject(ChangeDetectorRef);
  readonly #memberService = inject(MemberService);
  readonly #route = inject(ActivatedRoute);
  readonly #snackbar = inject(MatSnackBar);
  readonly #roleSubject$ = new BehaviorSubject<Role | undefined>(undefined);
  readonly #role$ = this.#roleSubject$.pipe(distinctUntilChanged((x, y) => x?.id === y?.id));

  #savedSelection?: Selection;
  protected readonly data$ = this.loadData();
  protected readonly newMemberRoleSubject$ = new BehaviorSubject<Role | undefined>(undefined);
  protected selectionForm = viewChild(NgForm);
  protected newMembers$?: Observable<Array<Member>>;
  protected newMemberDisabled = false;

  protected loadData(): Observable<{
    selection: Selection;
    members: Map<Role, Array<Member>>;
  }> {
    return getRouteData<Team>('team').pipe(
      filterNil(),
      switchMap((team) => this.loadTeamData(team)),
      tap(() => this.setupEvents()),
    );
  }

  protected loadTeamData(team: Team): Observable<{
    selection: Selection;
    members: Map<Role, Array<Member>>;
  }> {
    return forkJoin({
      members: this.getTeamMembers(team),
      selection: this.#selectionService.getLastOrNewSelection(team.id),
      newMember: this.getSelectedMember(),
    }).pipe(
      map(({ members, selection, newMember }) => {
        if (selection.id) {
          this.#savedSelection = Object.freeze(selection);
        }
        if (newMember) {
          if (selection.old_member?.role_id !== newMember.role_id) {
            // eslint-disable-next-line unicorn/no-null
            selection.old_member = null;
          }
          this.newMemberRoleSubject$.next(this.#roleService.get(newMember.role_id));
          this.#roleSubject$.next(this.#roleService.get(newMember.role_id));
          selection.new_member = newMember;
          selection.new_member_id = newMember.id;
          this.#changeRef.detectChanges();
        }
        this.oldMemberChange(selection.old_member);
        this.newMemberChange(selection.new_member);

        return { selection, members };
      }),
    );
  }

  protected setupEvents(): void {
    const role$: Observable<Role> = this.#role$.pipe(
      filterNil(),
      tap(() => {
        this.newMemberDisabled = true;
      }),
    );
    this.newMembers$ = combineLatest([role$, this.#app.requireTeam$]).pipe(
      switchMap(([role, team]) =>
        this.#memberService.getFree(team.championship.id, role.id, false),
      ),
      tap(() => {
        this.#changeRef.detectChanges();
        this.newMemberDisabled = false;
      }),
    );
  }

  protected getTeamMembers(team: Team): Observable<Map<Role, Array<Member>>> {
    return this.#memberService
      .getByTeamId(team.id)
      .pipe(map((data) => this.#roleService.groupMembersByRole(data)));
  }

  protected getSelectedMember(): Observable<Member | undefined> {
    return this.#route.queryParamMap.pipe(
      map((params) => params.get('new_member_id')),
      // eslint-disable-next-line unicorn/no-useless-undefined
      switchMap((id) => (id ? this.#memberService.getById(+id) : of(undefined))),
      first(),
    );
  }

  protected oldMemberChange(member: Member | null): void {
    if (member) {
      this.#roleSubject$.next(this.#roleService.get(member.role_id));
    }
  }

  protected newMemberChange(member: Member | null): void {
    if (member) {
      this.newMemberRoleSubject$.next(this.#roleService.get(member.role_id));
    }
  }

  protected compareFn(c1: Member | null, c2: Member | null): boolean {
    return c1?.id === c2?.id;
  }

  protected async save(selection: Partial<Selection>): Promise<void> {
    if (this.selectionForm()?.valid) {
      const save$ = this.#app.requireTeam$.pipe(
        switchMap((t) => {
          selection.team_id = t.id;
          selection.old_member_id = selection.old_member?.id ?? 0;
          selection.new_member_id = selection.new_member?.id ?? 0;
          delete selection.team;
          if (this.#savedSelection?.new_member_id !== selection.new_member_id) {
            delete selection.id;

            return this.#selectionService.create(selection as AtLeast<Selection, 'team_id'>);
          }

          return this.#selectionService.update(selection as Selection);
        }),
      );

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

  protected reset(): void {
    const role = undefined;
    this.#roleSubject$.next(role);
    this.newMemberRoleSubject$.next(role);
  }
}
