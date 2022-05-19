import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, firstValueFrom, forkJoin, Observable, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  first,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { getRouteData, getUnprocessableEntityErrors } from '@app/functions';
import { ApplicationService } from '@app/services';
import { AtLeast } from '@app/types';
import { MemberService, RoleService, SelectionService } from '@data/services';
import { Member, Role, Selection, Team } from '@data/types';

@Component({
  selector: 'app-selection',
  styleUrls: ['./selection.component.scss'],
  templateUrl: './selection.component.html',
})
export class SelectionComponent {
  @ViewChild(NgForm) public selectionForm?: NgForm;

  public data$: Observable<{ selection: Selection; members: Map<Role, Array<Member>> }>;
  public newMembers$?: Observable<Array<Member>>;
  public newMemberDisabled = false;
  public readonly newMemberRoleSubject$: BehaviorSubject<Role | undefined> = new BehaviorSubject<
    Role | undefined
  >(undefined);
  private readonly roleSubject$: BehaviorSubject<Role | undefined> = new BehaviorSubject<
    Role | undefined
  >(undefined);
  private readonly role$: Observable<Role | undefined>;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly selectionService: SelectionService,
    private readonly app: ApplicationService,
    private readonly roleService: RoleService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
  ) {
    this.role$ = this.roleSubject$.pipe(distinctUntilChanged((x, y) => x?.id === y?.id));
    this.data$ = this.loadData();
  }

  public loadData(): Observable<{ selection: Selection; members: Map<Role, Array<Member>> }> {
    return getRouteData<Team>(this.route, 'team').pipe(
      filter((team): team is Team => team !== undefined),
      switchMap((team) => this.loadTeamData(team)),
      tap(() => this.setupEvents()),
    );
  }

  public loadTeamData(
    team: Team,
  ): Observable<{ selection: Selection; members: Map<Role, Array<Member>> }> {
    return forkJoin({
      members: this.getTeamMembers(team),
      selection: this.selectionService.getLastOrNewSelection(team.id),
      newMember: this.getSelectedMember(),
    }).pipe(
      map(({ members, selection, newMember }) => {
        if (newMember) {
          if (selection.old_member?.role_id !== newMember.role_id) {
            selection.old_member = null;
          }
          this.newMemberRoleSubject$.next(this.roleService.getById(newMember.role_id));
          this.roleSubject$.next(this.roleService.getById(newMember.role_id));
          selection.new_member = newMember;
          selection.new_member_id = newMember.id;
          this.changeRef.detectChanges();
        }
        this.oldMemberChange(selection.old_member);
        this.newMemberChange(selection.new_member);
        return { selection, members };
      }),
    );
  }

  public setupEvents(): void {
    const newMember$ = this.role$.pipe(
      tap((r) => {
        console.log(r);
      }),
      filter((r): r is Role => r !== undefined),
      tap((r) => {
        this.newMemberDisabled = true;
        console.log(r);
      }),
    );
    this.newMembers$ = combineLatest([newMember$, this.app.requireTeam$]).pipe(
      switchMap(([role, team]) => this.memberService.getFree(team.championship.id, role.id, false)),
      tap(() => {
        this.changeRef.detectChanges();
        this.newMemberDisabled = false;
      }),
    );
  }

  public getTeamMembers(team: Team): Observable<Map<Role, Array<Member>>> {
    return this.memberService
      .getByTeamId(team.id)
      .pipe(map((data) => this.roleService.groupMembersByRole(data)));
  }

  public getSelectedMember(): Observable<Member | undefined> {
    return this.route.queryParamMap.pipe(
      map((params) => params.get('new_member_id')),
      switchMap((id) => (id ? this.memberService.getById(+id) : of(undefined))),
      first(),
    );
  }

  public oldMemberChange(member: Member | null): void {
    if (member) {
      this.roleSubject$.next(this.roleService.getById(member.role_id));
    }
  }

  public newMemberChange(member: Member | null): void {
    if (member) {
      this.newMemberRoleSubject$.next(this.roleService.getById(member.role_id));
    }
  }

  public compareFn(c1: Member | null, c2: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1?.id === c2?.id : c1 === c2;
  }

  public async save(selection: Partial<Selection>): Promise<void> {
    if (this.selectionForm?.valid) {
      return firstValueFrom(
        this.app.requireTeam$.pipe(
          map((t) => {
            delete selection.id;
            delete selection.team;
            selection.team_id = t.id;
            selection.old_member_id = selection.old_member?.id || 0;
            selection.new_member_id = selection.new_member?.id || 0;
            return selection as AtLeast<Selection, 'team_id'>;
          }),
          switchMap((sel) => this.selectionService.create(sel)),
          map((res: Partial<Selection>) => {
            this.snackBar.open('Selezione salvata correttamente', undefined, {
              duration: 3000,
            });
            if (res.id) {
              selection.id = res.id;
            }
          }),
          catchError((err: unknown) => getUnprocessableEntityErrors(err, this.selectionForm)),
        ),
        { defaultValue: undefined },
      );
    }
  }

  public descOrder = (a: KeyValue<Role, Array<Member>>, b: KeyValue<Role, Array<Member>>): number =>
    a.key.id < b.key.id ? b.key.id : a.key.id;

  public reset(): void {
    this.roleSubject$.next(undefined);
    this.newMemberRoleSubject$.next(undefined);
  }

  public track(_: number, item: KeyValue<Role, Array<Member>>): number {
    return item.key.id;
  }

  public trackMember(_: number, item: Member): number {
    return item.id;
  }
}
