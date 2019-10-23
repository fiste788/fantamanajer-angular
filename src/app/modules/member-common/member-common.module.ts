import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { CommonModule } from '@angular/common';

import { MemberSelectionComponent } from './components/member-selection/member-selection.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { MemberIconsComponent } from './components/member-icons/member-icons.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    MemberSelectionComponent,
    MemberListComponent,
    MemberIconsComponent
  ],
  declarations: [
    MemberSelectionComponent,
    MemberListComponent,
    MemberIconsComponent
  ],
})
export class MemberCommonModule { }
