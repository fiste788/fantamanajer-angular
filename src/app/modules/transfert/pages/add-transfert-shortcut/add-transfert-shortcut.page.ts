import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationService } from '@app/services';
import { Team } from '@data/types';
import { firstValueFrom, filter, switchMap } from 'rxjs';

@Component({
  template: '',
})
export class AddTransfertShortcutPage implements OnInit {
  constructor(private readonly router: Router, private readonly app: ApplicationService) {}

  public async ngOnInit(): Promise<boolean> {
    return firstValueFrom(
      this.app.teamChange$.pipe(
        filter((t): t is Team => t !== undefined),
        switchMap(async (t) => this.router.navigate(['teams', t.id, 'transfert'])),
      ),
      { defaultValue: false },
    );
  }
}
