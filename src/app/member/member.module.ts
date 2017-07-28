import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

// import { MemberRoutingModule } from './member-routing.module';
import { MemberListComponent } from './member-list/member-list.component';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [MemberListComponent],
  declarations: [MemberListComponent]
})
export class MemberModule { }
