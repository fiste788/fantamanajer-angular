import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { MemberListComponent } from './member-list/member-list.component';
import { MemberService } from './member.service';
import { MemberSelectionComponent } from './member-selection/member-selection.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [MemberListComponent, MemberSelectionComponent],
  declarations: [MemberListComponent, MemberSelectionComponent],
  providers: [MemberService]
})
export class MemberCommonModule { }
