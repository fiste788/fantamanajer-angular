import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, share, tap } from 'rxjs/operators';

import { MemberService, RoleService, SelectionService } from '@app/http';
import { ApplicationService, UtilService } from '@app/services';
import { Member, Role, Selection, Team } from '@shared/models';

@Component({
  selector: 'fm-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {
  @ViewChild('newMember') newMember: MatSelect;
  @ViewChild(NgForm) selectionForm: NgForm;

  selection: Selection = new Selection();
  members$: Observable<Map<Role, Array<Member>>>;
  newMembers$?: Observable<Array<Member>>;
  newPlayerRole$: BehaviorSubject<Role | undefined> = new BehaviorSubject<Role | undefined>(undefined);
  private readonly role$: Subject<Role> = new Subject<Role>();

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly selectionService: SelectionService,
    private readonly app: ApplicationService,
    private readonly roleService: RoleService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const teamId = UtilService.getSnapshotData<Team>(this.route, 'team')?.id;
    if (teamId) {
      this.loadData(teamId);
      this.setupEvents();
    }
  }

  loadData(teamId: number): void {
    this.selectionService.getSelection(teamId)
      .subscribe(selection => {
        if (selection !== null) {
          this.selection = selection;
          this.playerChange();
        }
      });

    this.members$ = this.memberService.getByTeamId(teamId)
      .pipe(
        map(data => this.roleService.groupMembersByRole(data)),
        tap(() => {
          const id = this.route.snapshot.queryParamMap.get('new_member_id');
          if (id !== null) {
            const memberId = parseInt(id, 10);
            this.memberService.getById(memberId)
              .subscribe(member => {
                this.role$.next(this.roleService.getById(member.role_id));
                this.newPlayerRole$.next(this.roleService.getById(member.role_id));
                this.selection.new_member = member;
                this.selection.new_member_id = member.id;
                this.changeRef.detectChanges();
              });
          }
        }));
  }

  setupEvents(): void {
    this.role$.pipe(
      distinctUntilChanged((x, y) => y === undefined || x.id === y.id),
      share()
    )
      .subscribe({
        next: this.loadMembers.bind(this)
      });
  }

  loadMembers(role?: Role): void {
    if (role) {
      this.newMember.disabled = true;
      if (this.app.championship) {
        this.newMembers$ = this.memberService.getFree(this.app.championship.id, role.id, false)
          .pipe(
            map(members => {
              this.changeRef.detectChanges();
              this.newMember.disabled = false;

              return members;
            })
          );
      }
    }
  }

  playerChange(): void {
    if (this.selection.old_member !== null) {
      this.role$.next(this.selection.old_member.role);
    }
  }

  compareFn(c1: Member, c2: Member): boolean {
    return c1 !== null && c2 !== null ? c1?.id === c2?.id : c1 === c2;
  }

  save(): void {
    if (this.selectionForm.valid === true) {
      const selection = new Selection();
      if (this.selection.id) {
        selection.id = this.selection.id;
      }
      selection.new_member_id = this.selection.new_member.id;
      selection.old_member_id = this.selection.old_member.id;
      selection.team_id = this.app.team?.id ?? 0;
      selection.id ? this.selectionService.update(selection) : this.selectionService.create(selection)
        .subscribe((response: Selection) => {
          this.snackBar.open('Selezione salvata correttamente', undefined, {
            duration: 3000
          });
          this.selection.id = response.id;
        },
          err => {
            UtilService.getUnprocessableEntityErrors(this.selectionForm, err);
          }
        );
    }
  }

  descOrder = (a: KeyValue<Role, Array<Member>>, b: KeyValue<Role, Array<Member>>) =>
    a.key.id < b.key.id ? b.key.id : a.key.id;

  isDisabled(role: Role): boolean {
    return this.selection.new_member !== null &&
      role !== this.roleService.getById(this.selection.new_member.role_id);
  }

  reset(): void {
    delete this.selection.new_member;
    delete this.selection.new_member_id;
    this.newMember.value = undefined;
    this.newMembers$ = undefined;
    this.role$.next();
    this.newPlayerRole$.next(undefined);
  }

  track(_: number, item: KeyValue<Role, Array<Member>>): number {
    return item.key.id;
  }

  trackMember(_: number, item: Member): number {
    return item.id;
  }
}
