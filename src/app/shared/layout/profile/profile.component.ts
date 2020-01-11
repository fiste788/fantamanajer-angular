import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApplicationService, LayoutService } from '@app/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'fm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    public app: ApplicationService,
    private layoutService: LayoutService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.app.teamChange.subscribe(t => {
      if (t) {
        this.router.navigateByUrl('/teams/' + t.id);
        this.layoutService.closeSidebar();
        this.cd.detectChanges();
      }
    });
  }
}
