import { Component, inject, linkedSignal } from '@angular/core';

import { AuthenticationService } from '@app/authentication';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  imports: [StreamComponent],
  templateUrl: './user-stream.page.html',
})
export class UserStreamPage {

  readonly #autheticationSerice = inject(AuthenticationService);

  protected readonly id = linkedSignal(() => this.#autheticationSerice.currentUser()!.id);

}
