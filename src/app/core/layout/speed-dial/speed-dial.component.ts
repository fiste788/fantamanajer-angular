import { Component } from '@angular/core';

import { ApplicationService } from '@app/services';

@Component({
  selector: 'fm-speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss']
})
export class SpeedDialComponent {
  openSpeeddial = false;

  constructor(
    public app: ApplicationService
  ) { }
}
