import { AsyncPipe, KeyValue, KeyValuePipe } from '@angular/common';
import { ChangeDetectorRef, Component, viewChild, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {
  combineLatest,
  forkJoin,
  Observable,
  of,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
  firstValueFrom,
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
  readonly #role = signal<Role | undefined>(undefined);
  readonly #role$ = toObservable(this.#role).pipe(distinctUntilChanged((x, y) => x?.id === y?.id));
  readonly #team = toObservable(this.#app.requireTeam);

  #savedSelection?: Selection;
  protected readonly data$ = this.loadData();
  protected readonly newMemberRole = signal<Role | undefined>(undefined);
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
          this.newMemberRole.set(this.#roleService.get(newMember.role_id));
          this.#role.set(this.#roleService.get(newMember.role_id));
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
    this.newMembers$ = combineLatest([role$, this.#team]).pipe(
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

  protected async getSelectedMember(): Promise<Member | undefined> {
    return firstValueFrom(
      this.#route.queryParamMap.pipe(
        map((params) => params.get('new_member_id')),
        switchMap((id) => (id ? this.#memberService.getById(+id) : of(undefined))),
      ),
      { defaultValue: undefined },
    );
  }

  protected oldMemberChange(member: Member | null): void {
    if (member) {
      this.#role.set(this.#roleService.get(member.role_id));
    }
  }

  protected newMemberChange(member: Member | null): void {
    if (member) {
      this.newMemberRole.set(this.#roleService.get(member.role_id));
    }
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

  protected reset(): void {
    const role = undefined;
    this.#role.set(role);
    this.newMemberRole.set(role);
  }
}
