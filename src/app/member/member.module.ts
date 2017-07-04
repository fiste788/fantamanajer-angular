import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// import { MemberRoutingModule } from './member-routing.module';
import { MemberListComponent } from './member-list/member-list.component';

@NgModule({
  imports: [RouterModule, CommonModule],
  exports: [MemberListComponent, RouterModule],
  declarations: [MemberListComponent]
})
export class MemberModule { }
