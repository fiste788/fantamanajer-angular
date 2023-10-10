import { trigger } from '@angular/animations';
import { NgIf, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';

import { Tab } from '@data/types';
import { routerTransition } from '@shared/animations';
import { StatePipe } from '@shared/pipes';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  styleUrls: ['./user.page.scss'],
  templateUrl: './user.page.html',
  standalone: true,
  imports: [NgIf, MatTabsModule, NgFor, RouterLinkActive, RouterLink, RouterOutlet, StatePipe],
})
export class UserPage {
  protected readonly tabs: Array<Tab> = [
    { label: 'Profilo', link: 'profile' },
    { label: 'Passkey', link: 'passkeys' },
    { label: 'Attività', link: 'stream' },
  ];

  protected track(_: number, item: Tab): string {
    return item.link;
  }
}
