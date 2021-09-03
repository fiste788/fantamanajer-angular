import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { SharedModule } from '@shared/shared.module';

import { LineupDetailComponent } from './components/lineup-detail/lineup-detail.component';
import { MemberAlreadySelectedValidator } from './components/lineup-detail/member-already-selected-validator.directive';
import { ModuleAreaComponent } from './components/module-area/module-area.component';
import { LineupOptionsComponent } from './components/lineup-options/lineup-options.component';

@NgModule({
  declarations: [
    LineupDetailComponent,
    MemberAlreadySelectedValidator,
    ModuleAreaComponent,
    LineupOptionsComponent,
  ],
  exports: [LineupDetailComponent, MemberAlreadySelectedValidator, ModuleAreaComponent],
  imports: [SharedModule, MemberCommonModule, MatExpansionModule],
})
export class LineupCommonModule {}
