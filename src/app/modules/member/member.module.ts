import { NgModule } from '@angular/core';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { SharedModule } from '@shared/shared.module';

import { MemberRoutingModule } from './member-routing.module';

@NgModule({
  declarations: [MemberRoutingModule.components],
  imports: [MemberCommonModule, MemberRoutingModule, SharedModule],
})
export default class MemberModule {}
