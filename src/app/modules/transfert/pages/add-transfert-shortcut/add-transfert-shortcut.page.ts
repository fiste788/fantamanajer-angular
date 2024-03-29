import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, switchMap } from 'rxjs';

import { ApplicationService } from '@app/services';

@Component({
  template: '',
  standalone: true,
})
export class AddTransfertShortcutPage implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly app: ApplicationService,
  ) {}

  public async ngOnInit(): Promise<boolean> {
    return firstValueFrom(
      this.app.requireTeam$.pipe(
        switchMap(async (t) => this.router.navigate(['teams', t.id, 'transferts'])),
      ),
      { defaultValue: false },
    );
  }
}
