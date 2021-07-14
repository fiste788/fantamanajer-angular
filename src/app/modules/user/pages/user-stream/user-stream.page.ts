import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/authentication';

import { User } from '@data/types';
import { filter, Observable, pluck } from 'rxjs';

@Component({
  styleUrls: ['./user-stream.page.scss'],
  templateUrl: './user-stream.page.html',
})
export class UserStreamPage implements OnInit {
  public id$: Observable<number>;

  constructor(private readonly auth: AuthenticationService) {}

  public ngOnInit(): void {
    this.id$ = this.auth.userChange$.pipe(
      filter((user): user is User => user != undefined),
      pluck('id'),
    );
  }
}
