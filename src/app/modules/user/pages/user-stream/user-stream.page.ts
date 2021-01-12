import { Component, OnInit } from '@angular/core';

import { ApplicationService } from '@app/services';

@Component({
  styleUrls: ['./user-stream.page.scss'],
  templateUrl: './user-stream.page.html',
})
export class UserStreamPage implements OnInit {
  public id: number;

  constructor(private readonly app: ApplicationService) {}

  public ngOnInit(): void {
    this.id = this.app.user?.id ?? 0;
  }
}
