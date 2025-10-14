import { Component } from '@angular/core';

import { Tab } from '@data/types';
import { PrimaryTabComponent } from '@shared/components/primary-tab/primary-tab.component';

@Component({
  templateUrl: './user.page.html',
  imports: [PrimaryTabComponent],
})
export class UserPage {
  protected readonly tabs: Array<Tab> = [
    { label: 'Profilo', link: 'profile' },
    { label: 'Passkey', link: 'passkeys' },
    { label: 'Attività', link: 'stream' },
  ];
}
