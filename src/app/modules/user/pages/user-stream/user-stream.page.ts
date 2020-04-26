import { Component, OnInit } from '@angular/core';

import { ApplicationService } from '@app/services';

@Component({
  templateUrl: './user-stream.page.html',
  styleUrls: ['./user-stream.page.scss']
})
export class UserStreamPage implements OnInit {
  id?: number;

  constructor(private readonly app: ApplicationService) { }

  ngOnInit(): void {
    this.id = this.app.user?.id;
  }
}
