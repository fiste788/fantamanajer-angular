import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { filter, map } from 'rxjs/operators';

import { PublicKeyCredentialSourceService, WebauthnService } from '@data/services';
import { ApplicationService } from '@app/services';
import { tableRowAnimation } from '@shared/animations';
import { PublicKeyCredentialSource } from '@data/types';
import { Observable, Subscription } from 'rxjs';

@Component({
  animations: [tableRowAnimation],
  selector: 'app-device-list',
  styleUrls: ['./device-list.page.scss'],
  templateUrl: './device-list.page.html',
})
export class DeviceListPage implements OnInit, OnDestroy {
  public dataSource$: Observable<MatTableDataSource<PublicKeyCredentialSource>>;
  public displayedColumns = ['name', 'created_at', 'counter', 'actions'];

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly webauthnService: WebauthnService,
    private readonly pbcsService: PublicKeyCredentialSourceService,
    public app: ApplicationService,
  ) {}

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    if (this.app.user) {
      this.dataSource$ = this.pbcsService
        .index(this.app.user.id)
        .pipe(map((data) => new MatTableDataSource<PublicKeyCredentialSource>(data)));
    }
  }

  public register(): void {
    this.subscriptions.add(
      this.webauthnService
        .createPublicKey()
        .pipe(filter((p) => p !== undefined))
        .subscribe(() => {
          this.loadData();
        }),
    );
  }

  public unregister(publicKey: PublicKeyCredentialSource): void {
    if (this.app.user) {
      this.subscriptions.add(
        this.pbcsService.delete(this.app.user.id, publicKey.id).subscribe(() => {
          this.loadData();
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
