import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MemberListComponent } from './member-list/member-list.component';
import { MemberService } from './member.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [MemberListComponent],
  declarations: [MemberListComponent],
  providers: [MemberService]
})
export class MemberModule { }
