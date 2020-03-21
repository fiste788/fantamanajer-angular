import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TransfertService } from '@app/http';
import { ApplicationService, UtilService } from '@app/services';
import { tableRowAnimation } from '@shared/animations';
import { Transfert } from '@shared/models';

@Component({
  selector: 'fm-transfert-list',
  templateUrl: './transfert-list.component.html',
  styleUrls: ['./transfert-list.component.scss'],
  animations: [tableRowAnimation]
})
export class TransfertListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  teamId?: number;
  dataSource: MatTableDataSource<Transfert>;
  displayedColumns = ['old_member', 'new_member', 'constraint', 'matchday'];

  constructor(
    private readonly transfertService: TransfertService,
    private readonly route: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    public app: ApplicationService
  ) { }

  ngOnInit(): void {
    this.teamId = UtilService.getTeamId(this.route);
    if (this.teamId) {
      // this.dataSource._updateChangeSubscription = () => this.dataSource.sort = this.sort;
      this.transfertService.getTransfert(this.teamId)
        .subscribe(data => {
          this.dataSource = new MatTableDataSource<Transfert>(data);
          if (data.length) {
            this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
            this.ref.detectChanges();
            this.dataSource.sort = this.sort;
          }
        });
    }
  }

  sortingDataAccessor(data: Transfert, sortHeaderId: string): string {
    let value;
    switch (sortHeaderId) {
      case 'old_member': value = data.old_member.player.full_name; break;
      case 'new_member': value = data.new_member.player.full_name; break;
      default:
    }

    return value ?? '';
  }
}
