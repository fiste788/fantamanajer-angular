import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MemberRoutingModule } from './member-routing.module';
import { MemberModule } from './member.module';
import { MemberComponent } from './member/member.component';
import { MemberFreeComponent } from './member-free/member-free.component';

@NgModule({
  imports: [
    SharedModule,
    MemberModule,
    MemberRoutingModule
  ],
  exports: [],
  declarations: [MemberFreeComponent, MemberComponent],
})
export class MemberLazyModule { }
