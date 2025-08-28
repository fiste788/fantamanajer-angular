import { Component, inject, linkedSignal } from '@angular/core';

import { AuthenticationService } from '@app/authentication';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './user-stream.page.html',
  imports: [StreamComponent],
})
export class UserStreamPage {
  protected readonly authService = inject(AuthenticationService);
  protected readonly id = linkedSignal(() => this.authService.user()!.id);
}
