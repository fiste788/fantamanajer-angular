import { Component } from '@angular/core';
import { ApplicationService, LayoutService } from '@app/core/services';

@Component({
  selector: 'fm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor(
    public app: ApplicationService,
    private layoutService: LayoutService,
  ) { }

  change() {
    this.layoutService.closeSidebar();
  }
}
