import { Component, inject, linkedSignal } from '@angular/core';

import { AuthenticationService } from '@app/authentication';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './user-stream.page.html',
  imports: [StreamComponent],
})
export class UserStreamPage {
  readonly #autheticationSerice = inject(AuthenticationService);
  protected readonly id = linkedSignal(() => this.#autheticationSerice.currentUser()!.id);
}
