import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '@app/core/services';

@Component({
  selector: 'fm-user-stream',
  templateUrl: './user-stream.component.html',
  styleUrls: ['./user-stream.component.scss']
})
export class UserStreamComponent implements OnInit {

  id?: number;

  constructor(private app: ApplicationService) { }

  ngOnInit() {
    this.id = this.app.user?.id;
  }
}

