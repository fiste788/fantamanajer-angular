import { Component } from '@angular/core';

import { ApplicationService } from '@app/services';

@Component({
  selector: 'app-speed-dial',
  styleUrls: ['./speed-dial.component.scss'],
  templateUrl: './speed-dial.component.html',
})
export class SpeedDialComponent {
  protected openSpeeddial = false;

  constructor(protected readonly app: ApplicationService) {}

  public close(): void {
    this.openSpeeddial = false;
  }
}
