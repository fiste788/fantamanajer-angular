import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, share, tap } from 'rxjs/operators';

import { MemberService, RoleService, SelectionService } from '@data/services';
import { ApplicationService, UtilService } from '@app/services';
import { Member, Role, Selection, Team } from '@data/types';

@Component({
  selector: 'app-selection',
  styleUrls: ['./selection.component.scss'],
  templateUrl: './selection.component.html',
})
export class SelectionComponent implements OnInit {
  @ViewChild('newMember') public newMember: MatSelect;
  @ViewChild(NgForm) public selectionForm: NgForm;

  public selection: Selection = new Selection();
  public members$: Observable<Map<Role, Array<Member>>>;
  public newMembers$?: Observable<Array<Member>>;
  public newPlayerRole$: BehaviorSubject<Role | undefined> = new BehaviorSubject<Role | undefined>(undefined);
  private readonly role$: Subject<Role> = new Subject<Role>();

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly selectionService: SelectionService,
    private readonly app: ApplicationService,
    private readonly roleService: RoleService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
  ) {
  }

  public ngOnInit(): void {
    const teamId = UtilService.getSnapshotData<Team>(this.route, 'team')?.id;
    if (teamId) {
      this.loadData(teamId);
      this.setupEvents();
    }
  }

  public loadData(teamId: number): void {
    this.selectionService.getSelection(teamId)
      .subscribe((selection) => {
        this.selection = selection;
        this.playerChange();
      });

    this.members$ = this.memberService.getByTeamId(teamId)
      .pipe(
        map(data => this.roleService.groupMembersByRole(data)),
        tap(() => {
          const id = this.route.snapshot.queryParamMap.get('new_member_id');
          if (id !== null) {
            this.memberService.getById(+id)
              .subscribe((member) => {
                this.role$.next(this.roleService.getById(member.role_id));
                this.newPlayerRole$.next(this.roleService.getById(member.role_id));
                this.selection.new_member = member;
                this.selection.new_member_id = member.id;
                this.changeRef.detectChanges();
              });
          }
        }));
  }

  public setupEvents(): void {
    this.role$.pipe(
      distinctUntilChanged((x, y) => x.id === y.id),
      share(),
    )
      .subscribe({
        next: this.loadMembers.bind(this),
      });
  }

  public loadMembers(role?: Role): void {
    if (role) {
      this.newMember.disabled = true;
      if (this.app.championship) {
        this.newMembers$ = this.memberService.getFree(this.app.championship.id, role.id, false)
          .pipe(
            map((members) => {
              this.changeRef.detectChanges();
              this.newMember.disabled = false;

              return members;
            }),
          );
      }
    }
  }

  public playerChange(): void {
    if (this.selection.old_member !== null) {
      this.role$.next(this.selection.old_member.role);
    }
  }

  public compareFn(c1: Member | null, c2: Member | null): boolean {
    return c1 !== null && c2 !== null ? c1?.id === c2?.id : c1 === c2;
  }

  public save(): void {
    if (this.selectionForm.valid === true) {
      const selection = new Selection();
      if (this.selection.id) {
        selection.id = this.selection.id;
      }
      selection.new_member_id = this.selection.new_member?.id || 0;
      selection.old_member_id = this.selection.old_member?.id || 0;
      selection.team_id = this.app.team?.id ?? 0;
      const obs: Observable<Partial<Selection>> = selection.id ? this.selectionService.update(selection) :
        this.selectionService.create(selection);
      obs.subscribe((response: Partial<Selection>) => {
        this.snackBar.open('Selezione salvata correttamente', undefined, {
          duration: 3000,
        });
        if (response.id) {
          this.selection.id = response.id;
        }
      },
        (err) => {
          UtilService.getUnprocessableEntityErrors(this.selectionForm, err);
        },
      );
    }
  }

  public descOrder = (a: KeyValue<Role, Array<Member>>, b: KeyValue<Role, Array<Member>>): number =>
    a.key.id < b.key.id ? b.key.id : a.key.id

  public isDisabled(role: Role): boolean {
    return this.selection.new_member !== null &&
      role !== this.roleService.getById(this.selection.new_member.role_id);
  }

  public reset(): void {
    this.selection = new Selection();
    this.role$.next();
    this.newPlayerRole$.next(undefined);
  }

  public track(_: number, item: KeyValue<Role, Array<Member>>): number {
    return item.key.id;
  }

  public trackMember(_: number, item: Member): number {
    return item.id;
  }
}
