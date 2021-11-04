import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationService } from '@app/services';
import { firstValueFrom, switchMap } from 'rxjs';

@Component({
  template: '',
})
export class AddTransfertShortcutPage implements OnInit {
  constructor(private readonly router: Router, private readonly app: ApplicationService) {}

  public async ngOnInit(): Promise<boolean> {
    return firstValueFrom(
      this.app.requireTeam$.pipe(
        switchMap(async (t) => this.router.navigate(['teams', t.id, 'transfert'])),
      ),
      { defaultValue: false },
    );
  }
}
