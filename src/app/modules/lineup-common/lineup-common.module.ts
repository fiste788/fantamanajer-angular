import { NgModule } from '@angular/core';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { SharedModule } from '@shared/shared.module';

import { LineupDetailComponent } from './components/lineup-detail/lineup-detail.component';
import { MemberAlreadySelectedValidator } from './components/lineup-detail/member-already-selected-validator.directive';
import { ModuleAreaComponent } from './components/module-area/module-area.component';

@NgModule({
  declarations: [LineupDetailComponent, MemberAlreadySelectedValidator, ModuleAreaComponent],
  exports: [LineupDetailComponent, MemberAlreadySelectedValidator, ModuleAreaComponent],
  imports: [SharedModule, MemberCommonModule],
})
export class LineupCommonModule {}
