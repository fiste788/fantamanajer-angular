import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './user-stream.page.html',
  imports: [StreamComponent, AsyncPipe],
})
export class UserStreamPage {
  protected readonly id$ = inject(AuthenticationService).requireUser$.pipe(map((u) => u.id));
}
