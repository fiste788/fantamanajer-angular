import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { MemberRoutingModule } from './member-routing.module';
import { MemberFreeComponent } from './pages/member-free/member-free.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MemberCommonModule,
    MemberRoutingModule
  ],
  exports: [],
  declarations: [
    MemberFreeComponent
  ]
})
export class MemberModule { }
