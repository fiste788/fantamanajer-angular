import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { Observable, Subject } from 'rxjs';
import { Selection, Member, Role } from '@app/core/models';
import { SelectionService, MemberService, ApplicationService, RoleService } from '@app/core/services';
import { SharedService } from '@app/shared/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { map, distinctUntilChanged, share, reduce, mergeMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'fm-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {
  @ViewChild('newMember') newMember: MatSelect;
  @ViewChild(NgForm) selectionForm: NgForm;

  selection: Selection = new Selection();
  members: Observable<Map<Role, Member[]>>;
  newMembers?: Observable<Member[]>;
  role: Subject<Role> = new Subject<Role>();
  disableOthers: boolean;

  constructor(
    public snackBar: MatSnackBar,
    private selectionService: SelectionService,
    private app: ApplicationService,
    private roleService: RoleService,
    private changeRef: ChangeDetectorRef,
    private memberService: MemberService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const teamId = SharedService.getTeamId(this.route);
    if (teamId) {
      this.selectionService.getSelection(teamId).subscribe(selection => {
        if (selection) {
          this.selection = selection;
          this.playerChange();
        }
      });

      this.role.pipe(
        distinctUntilChanged((x, y) => !y || x.id === y.id),
        share()
      ).subscribe({
        next: this.loadMembers.bind(this)
      });

      this.members = this.memberService.getByTeamId(teamId).pipe(
        map(data => this.roleService.groupMembersByRole(data)),
        map(members => {
          const id = this.route.snapshot.queryParamMap.get('new_member_id');
          if (id) {
            const memberId = parseInt(id, 10);
            this.memberService.getById(memberId).subscribe(member => {
              this.role.next(this.roleService.getById(member.role_id));
              this.selection.new_member = member;
              this.selection.new_member_id = member.id;
              this.disableOthers = true;
              this.changeRef.detectChanges();
            });
          }
          return members;
        }));
    }
  }

  loadMembers(role?: Role) {
    if (role) {
      this.disableOthers = false;
      this.newMember.disabled = true;
      if (this.app.championship) {
        this.newMembers = this.memberService.getFree(this.app.championship.id, role.id, false).pipe(
          map(members => {
            this.changeRef.detectChanges();
            this.newMember.disabled = false;
            return members;
          }));
      }
    }
  }

  playerChange() {
    if (this.selection.old_member) {
      this.role.next(this.selection.old_member.role);
    }
  }

  compareFn(c1: Member, c2: Member): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  save() {
    if (this.selectionForm.valid) {
      const selection = new Selection();
      if (this.selection.id) {
        selection.id = this.selection.id;
      }
      selection.new_member_id = this.selection.new_member.id;
      selection.old_member_id = this.selection.old_member.id;
      selection.team_id = this.app.team?.id || 0;
      let obs = null;
      if (selection.id) {
        obs = this.selectionService.update(selection);
      } else {
        obs = this.selectionService.create(selection);
      }
      obs.subscribe((response: any) => {
        this.snackBar.open('Selezione salvata correttamente', undefined, {
          duration: 3000
        });
        this.selection.id = response.id;
      },
        err => SharedService.getUnprocessableEntityErrors(this.selectionForm, err)
      );
    }
  }

  descOrder = (a: any, b: any) => {
    if (a.key < b.key) {
      return b.key;
    }
  }

  isDisabled(role: Role) {
    return this.disableOthers &&
      this.selection.new_member &&
      role !== this.roleService.getById(this.selection.new_member.role_id);
  }

  reset() {
    this.disableOthers = false;
    delete this.selection.new_member;
    delete this.selection.new_member_id;
    this.newMember.value = undefined;
    this.newMembers = undefined;
    this.role.next();
  }
}
