import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '@app/services';

@Component({
  selector: 'fm-user-stream',
  templateUrl: './user-stream.component.html',
  styleUrls: ['./user-stream.component.scss']
})
export class UserStreamComponent implements OnInit {
  id?: number;

  constructor(private readonly app: ApplicationService) { }

  ngOnInit(): void {
    this.id = this.app.user?.id;
  }
}
