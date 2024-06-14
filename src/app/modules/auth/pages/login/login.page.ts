import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, viewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, firstValueFrom, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { addVisibleClassOnDestroy } from '@app/functions';
import { ApplicationService } from '@app/services';
import { Team } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  styleUrl: './login.page.scss',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatStepperModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatCheckboxModule,
  ],
})
export class LoginPage implements OnInit, OnDestroy {
  protected readonly stepper = viewChild.required<MatStepper>('stepper');
  protected readonly form = viewChild<NgForm>('f');
  protected readonly userForm = viewChild<NgForm>('userForm');
  protected loginData: {
    email?: string;
    password?: string;
  } = {};

  private readonly subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly app: ApplicationService,
    private readonly cd: ChangeDetectorRef,
  ) {
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  public ngOnInit(): void {
    this.subscription.add(this.connectLoginPasskey());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected async login(): Promise<boolean> {
    if (this.loginData.email && this.loginData.password) {
      try {
        const result = await firstValueFrom(
          this.authService.authenticate(this.loginData.email, this.loginData.password),
          { defaultValue: false },
        );

        return await this.postLogin(result);
      } catch {
        return false;
      }
    }

    return false;
  }

  protected async postLogin(result: boolean): Promise<boolean> {
    if (result) {
      return firstValueFrom(
        this.app.requireTeam$.pipe(
          map((t) => this.getUrl(t)),
          map(async (url) => this.router.navigateByUrl(url)),
        ),
        { defaultValue: false },
      );
    }
    const form = this.form();
    if (form) {
      const { password } = form.controls;
      password?.setErrors({ msg: 'Authentication failed' });
      this.cd.detectChanges();

      return false;
    }

    return false;
  }

  protected reset(): void {
    this.form()?.reset();
    this.userForm()?.resetForm();
    this.stepper().reset();
  }

  private connectLoginPasskey(): Subscription {
    return from(this.authService.authenticatePasskey())
      .pipe(switchMap(async (result) => this.postLogin(result)))
      .subscribe();
  }

  private getUrl(team: Team): string {
    return (
      (this.route.snapshot.queryParams['returnUrl'] as string | undefined) ??
      `/championships/${team.championship.id}`
    );
  }
}
