import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './user-stream.page.html',
  standalone: true,
  imports: [StreamComponent, AsyncPipe],
})
export class UserStreamPage {
  protected readonly id$: Observable<number>;

  constructor(private readonly auth: AuthenticationService) {
    this.id$ = this.auth.requireUser$.pipe(map((u) => u.id));
  }
}
