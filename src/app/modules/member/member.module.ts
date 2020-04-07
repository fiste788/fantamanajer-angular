import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { SharedModule } from '@shared/shared.module';

import { MemberRoutingModule } from './member-routing.module';
import { MemberFreeComponent } from './pages/member-free/member-free.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MemberCommonModule,
    MemberRoutingModule
  ],
  declarations: [
    MemberRoutingModule.components
  ]
})
export class MemberModule { }
