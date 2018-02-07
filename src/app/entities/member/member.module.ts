import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { MemberRoutingModule } from './member-routing.module';
import { MemberCommonModule } from './member-common.module';
import { MemberComponent } from './member/member.component';
import { MemberFreeComponent } from './member-free/member-free.component';

@NgModule({
  imports: [
    SharedModule,
    MemberCommonModule,
    MemberRoutingModule
  ],
  exports: [],
  declarations: [MemberFreeComponent, MemberComponent],
})
export class MemberModule { }
