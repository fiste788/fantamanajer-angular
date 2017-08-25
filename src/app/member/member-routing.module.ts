import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberFreeComponent } from './member-free/member-free.component';

const routes: Routes = [
  { path: '', redirectTo: 'free', pathMatch: 'full' },
  { path: 'free', component: MemberFreeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule {}
