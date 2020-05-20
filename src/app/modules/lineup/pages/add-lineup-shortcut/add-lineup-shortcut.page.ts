import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationService } from '@app/services';

@Component({
  template: ''
})
export class AddLineupShortcutPage implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly app: ApplicationService
  ) { }

  ngOnInit(): void {
    if (this.app.team) {
      void this.router.navigate(['teams', this.app.team.id, 'lineup', 'current']);
    }
  }

}
