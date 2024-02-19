import { trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { Tab } from '@data/types';
import { routerTransition } from '@shared/animations';
import { ToolbartTabComponent } from '@shared/components/toolbar-tab/toolbar-tab.component';

@Component({
  animations: [trigger('contextChange', routerTransition)],
  styleUrls: ['./user.page.scss'],
  templateUrl: './user.page.html',
  standalone: true,
  imports: [ToolbartTabComponent],
})
export class UserPage {
  protected readonly tabs: Array<Tab> = [
    { label: 'Profilo', link: 'profile' },
    { label: 'Passkey', link: 'passkeys' },
    { label: 'Attività', link: 'stream' },
  ];
}
