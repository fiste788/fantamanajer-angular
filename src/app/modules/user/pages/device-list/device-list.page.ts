import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { PublicKeyCredentialSourceService } from '@app/http';
import { ApplicationService } from '@app/services';
import { tableRowAnimation } from '@shared/animations';
import { PublicKeyCredentialSource } from '@shared/models';

@Component({
  animations: [tableRowAnimation],
  selector: 'app-device-list',
  styleUrls: ['./device-list.page.scss'],
  templateUrl: './device-list.page.html',
})
export class DeviceListPage implements OnInit {

  public teamId?: number;
  public dataSource: MatTableDataSource<PublicKeyCredentialSource>;
  public displayedColumns = ['name', 'created_at', 'counter'];

  constructor(
    private readonly pbcsService: PublicKeyCredentialSourceService,
    private readonly ref: ChangeDetectorRef,
    public app: ApplicationService,
  ) { }

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    if (this.app.user) {
      this.pbcsService.index(this.app.user.id)
        .subscribe((data) => {
          this.dataSource = new MatTableDataSource<PublicKeyCredentialSource>(data);
          if (data.length) {
            this.ref.detectChanges();
          }
        });
    }
  }
}
