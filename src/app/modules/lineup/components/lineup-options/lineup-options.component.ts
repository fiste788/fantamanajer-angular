import { DatePipe, KeyValuePipe } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import type { Lineup } from '@data/interfaces';
import { LayoutService } from '@layout/services';

import { LineupService } from '../lineup.service';

@Component({
  selector: 'app-lineup-options[lineup]',
  imports: [
    DatePipe,
    FormsModule,
    KeyValuePipe,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './lineup-options.component.html',
  styleUrl: './lineup-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class LineupOptionsComponent {

  protected readonly lineupService = inject(LineupService);
  protected readonly navigationMode = inject(LayoutService).navigationMode;

  public readonly captain = input(true, { transform: booleanAttribute });
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly jolly = input(true, { transform: booleanAttribute });
  public readonly lineup = input.required<Partial<Lineup>>();

}
