import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { MemberIconsComponent } from './components/member-icons/member-icons.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { MemberSelectionComponent } from './components/member-selection/member-selection.component';

@NgModule({
  declarations: [
    MemberSelectionComponent,
    MemberListComponent,
    MemberIconsComponent,
  ],
  exports: [
    MemberSelectionComponent,
    MemberListComponent,
    MemberIconsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
})
export class MemberCommonModule { }
