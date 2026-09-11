import { DecimalPipe } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import type { Disposition, Lineup } from '@data/interfaces';
import { CaptainPipe } from '@shared/pipes';

@Component({
  selector: 'app-disposition-list[caption]',
  imports: [CaptainPipe, DecimalPipe, MatCardModule, MatIconModule, MatTableModule, MatTooltipModule, RouterLink],
  templateUrl: './disposition-list.component.html',
  styleUrl: './disposition-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DispositionListComponent {

  public readonly caption = input.required<string>();
  public readonly dispositions = input<Disposition[]>();
  public readonly lineup = input<Lineup>();
  public readonly regular = input(false, { transform: booleanAttribute });

  protected readonly dataSource = computed(() => new MatTableDataSource(this.dispositions()));
  protected readonly displayedColumns = ['player', 'role', 'club', 'regular', 'yellow-card', 'red-card', 'assist', 'goals', 'points'];

  protected trackDisposition(_: number, item: Disposition): number {
    return item.id;
  }

}
