import { Component } from '@angular/core';

import type { Tab } from '@data/interfaces';
import { PrimaryTabComponent } from '@shared/components/primary-tab/primary-tab.component';

@Component({
  imports: [PrimaryTabComponent],
  templateUrl: './user.page.html',
})
export class UserPage {

  protected readonly tabs: Tab[] = [
    { label: 'Profilo', link: 'profile' },
    { label: 'Passkey', link: 'passkeys' },
    { label: 'Attività', link: 'stream' },
  ];

}
