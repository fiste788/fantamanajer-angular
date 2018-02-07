import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordResetInitComponent } from './password-reset/init/password-reset-init.component';

const routes: Routes = [
  { path: 'lost-password', component: PasswordResetInitComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
