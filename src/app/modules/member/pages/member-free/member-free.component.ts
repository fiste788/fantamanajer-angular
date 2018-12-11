import { Component, ViewChild, ChangeDetectorRef, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { SharedService } from '@app/shared/services/shared.service';
import { ApplicationService, MemberService } from '@app/core/services';
import { MemberListComponent } from '@app/modules/member-common/components/member-list/member-list.component';
import { Member, Role } from '@app/core/models';
import { TableRowAnimation } from 'app/core/animations';

@Component({
  selector: 'fm-member-free',
  templateUrl: './member-free.component.html',
  styleUrls: ['./member-free.component.scss'],
  animations: [TableRowAnimation]
})
export class MemberFreeComponent implements OnInit {
  @HostBinding('@tableRowAnimation') tableRowAnimation = '';
  @ViewChild(MemberListComponent) memberList: MemberListComponent;
  members: Observable<Member[]>;
  selectedRole: Role;
  roles: Role[] = [];

  constructor(
    private changeRef: ChangeDetectorRef,
    private memberService: MemberService,
    private route: ActivatedRoute,
    public app: ApplicationService
  ) {
    this.roles.push(new Role(1, 'Portiere'));
    this.roles.push(new Role(2, 'Difensore'));
    this.roles.push(new Role(3, 'Centrocampista'));
    this.roles.push(new Role(4, 'Attaccante'));
    this.selectedRole = this.roles[0];
  }

  ngOnInit() {
    this.roleChange();
  }

  roleChange() {
    this.members = null;
    this.changeRef.detectChanges();
    this.members = this.memberService
      .getFree(SharedService.getChampionshipId(this.route), this.selectedRole.id)
      .pipe(share());
  }
}
