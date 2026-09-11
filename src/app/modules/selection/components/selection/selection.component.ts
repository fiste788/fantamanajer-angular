import type { KeyValue } from '@angular/common';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { Component, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { forkJoin, map, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';

import { filterNil, getRouteData } from '@app/functions';
import { save } from '@app/functions/save.function';
import type { AtLeast } from '@app/interfaces';
import { AppService } from '@app/services';
import type { Member, Role, Selection, Team } from '@data/interfaces';
import { MemberService, RoleService, SelectionService } from '@data/services';

@Component({
  selector: 'app-selection',
  imports: [AsyncPipe, FormsModule, KeyValuePipe, MatButtonModule, MatFormFieldModule, MatProgressSpinnerModule, MatSelectModule],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.scss',
})
export class SelectionComponent {

  readonly #app = inject(AppService);
  readonly #memberService = inject(MemberService);
  readonly #roleService = inject(RoleService);
  readonly #route = inject(ActivatedRoute);
  readonly #selectionService = inject(SelectionService);
  readonly #snackbar = inject(MatSnackBar);

  protected readonly sellMember = signal<Member | undefined>(undefined);
  protected readonly role$ = toObservable(linkedSignal<Role | undefined>(() => this.sellMember()?.role));
  protected buyMembers$ = this.role$.pipe(
    filterNil(),
    switchMap(role => this.#memberService.getFreeMembers(this.#app.currentTeam()!.championship.id, role.id, false)),
  );

  protected readonly selectedMember = toSignal(this.getSelectedMember(), {
    initialValue: undefined,
  });
  protected readonly buyMember = linkedSignal(() => this.selectedMember());
  protected readonly data$ = this.loadData();
  protected readonly selectionForm = viewChild(NgForm);

  #savedSelection?: Partial<Selection>;

  protected compareFn(c1: Member | null, c2: Member | null): boolean {
    return c1?.id === c2?.id;
  }

  protected descOrder(a: KeyValue<Role, Member[]>, b: KeyValue<Role, Member[]>): number {
    return Math.max(a.key.id, b.key.id);
  }

  protected getSelectedMember(): Observable<Member> {
    return this.#route.queryParamMap.pipe(
      map(parameters => parameters.get('new_member_id')),
      filterNil(),
      switchMap(id => this.#memberService.getMemberById(+id)),
    );
  }

  protected getTeamMembers(team: Team): Observable<Map<Role, Member[]>> {
    return this.#memberService.getMembersByTeamId(team.id).pipe(map(data => this.#roleService.groupMembersByRole(data)));
  }

  protected loadData(): Observable<{
    members: Map<Role, Member[]>;
    selection: AtLeast<Selection, 'team_id'>;
  }> {
    return getRouteData<Team>('team').pipe(
      filterNil(),
      switchMap(team => this.loadTeamData(team)),
    );
  }

  protected loadTeamData(team: Team): Observable<{
    members: Map<Role, Member[]>;
    selection: AtLeast<Selection, 'team_id'>;
  }> {
    return forkJoin({
      members: this.getTeamMembers(team),
      selection: this.#selectionService.getLastOrNewTeamSelection(team.id),
    }).pipe(
      map(({ members, selection }) => {
        if (selection.id) {
          this.#savedSelection = Object.freeze(selection);
        }
        const selectedMember = this.selectedMember();
        if (selectedMember && selection.old_member?.role_id !== selectedMember.role_id) {
          selection.old_member = null;
        }
        this.buyMember.set(selection.new_member ?? undefined);
        this.sellMember.set(selection.old_member ?? undefined);

        return { members, selection };
      }),
    );
  }

  protected async save(selection: Partial<Selection>): Promise<void> {
    if (this.selectionForm()?.valid) {
      const team = this.#app.requireCurrentTeam();

      selection.team_id = team.id;
      selection.old_member_id = this.sellMember()?.id ?? 0;
      selection.new_member_id = this.buyMember()?.id ?? 0;
      delete selection.team;
      if (this.#savedSelection?.new_member_id !== selection.new_member_id) {
        delete selection.id;
      }

      const save$ = selection.id
        ? this.#selectionService.updateSelection(selection as Selection)
        : this.#selectionService.createSelection(selection as AtLeast<Selection, 'team_id'>);

      return save(save$, undefined, this.#snackbar, {
        callback: (result: Partial<Selection>) => {
          if (result.id) {
            selection.id = result.id;
          }
        },
        form: this.selectionForm(),
        message: 'Selezione salvata correttamento',
      });
    }

    return undefined;
  }

}
