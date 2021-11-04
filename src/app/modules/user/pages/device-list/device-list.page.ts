import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { filter, map, switchMap } from 'rxjs/operators';

import { PublicKeyCredentialSourceService, WebauthnService } from '@data/services';
import { tableRowAnimation } from '@shared/animations';
import { PublicKeyCredentialSource } from '@data/types';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable } from 'rxjs';
import { AuthenticationService } from '@app/authentication';

@Component({
  animations: [tableRowAnimation],
  selector: 'app-device-list',
  styleUrls: ['./device-list.page.scss'],
  templateUrl: './device-list.page.html',
})
export class DeviceListPage implements OnInit {
  public dataSource$: Observable<MatTableDataSource<PublicKeyCredentialSource>>;
  public refresh$: BehaviorSubject<true>;
  public displayedColumns = ['name', 'created_at', 'counter', 'actions'];

  constructor(
    private readonly webauthnService: WebauthnService,
    private readonly pbcsService: PublicKeyCredentialSourceService,
    private readonly auth: AuthenticationService,
  ) {
    this.refresh$ = new BehaviorSubject(true);
  }

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.dataSource$ = combineLatest([this.auth.requireUser$, this.refresh$]).pipe(
      switchMap(([user]) =>
        this.pbcsService
          .index(user.id)
          .pipe(map((data) => new MatTableDataSource<PublicKeyCredentialSource>(data))),
      ),
    );
  }

  public async register(): Promise<void> {
    return firstValueFrom(
      this.webauthnService.createPublicKey().pipe(
        filter((p) => p !== undefined),
        map(() => this.refresh$.next(true)),
      ),
    );
  }

  public async unregister(publicKey: PublicKeyCredentialSource): Promise<void> {
    return firstValueFrom(
      this.auth.requireUser$.pipe(
        switchMap((user) =>
          this.pbcsService.delete(user.id, publicKey.id).pipe(map(() => this.refresh$.next(true))),
        ),
      ),
    );
  }
}
