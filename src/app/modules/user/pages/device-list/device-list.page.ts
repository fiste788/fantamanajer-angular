import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { PublicKeyCredentialSourceService, WebauthnService } from '@data/services';
import { ApplicationService } from '@app/services';
import { tableRowAnimation } from '@shared/animations';
import { PublicKeyCredentialSource } from '@data/types';

@Component({
  animations: [tableRowAnimation],
  selector: 'app-device-list',
  styleUrls: ['./device-list.page.scss'],
  templateUrl: './device-list.page.html',
})
export class DeviceListPage implements OnInit {
  public dataSource: MatTableDataSource<PublicKeyCredentialSource>;
  public displayedColumns = ['name', 'created_at', 'counter', 'actions'];

  constructor(
    private readonly webauthnService: WebauthnService,
    private readonly pbcsService: PublicKeyCredentialSourceService,
    private readonly ref: ChangeDetectorRef,
    public app: ApplicationService,
  ) {}

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    if (this.app.user) {
      this.pbcsService.index(this.app.user.id).subscribe((data) => {
        this.dataSource = new MatTableDataSource<PublicKeyCredentialSource>(data);
        if (data.length) {
          this.ref.detectChanges();
        }
      });
    }
  }

  public register(): void {
    this.webauthnService
      .createPublicKey()
      .pipe(filter((p) => p !== undefined))
      .subscribe(() => {
        this.loadData();
      });
  }

  public unregister(publicKey: PublicKeyCredentialSource): void {
    if (this.app.user) {
      this.pbcsService.delete(this.app.user.id, publicKey.id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
