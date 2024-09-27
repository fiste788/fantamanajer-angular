import { NgIf, NgFor, DatePipe, KeyValuePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, booleanAttribute, input, inject } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Lineup } from '@data/types';

import { LineupService } from '../lineup.service';

@Component({
  selector: 'app-lineup-options[lineup]',
  templateUrl: './lineup-options.component.html',
  styleUrl: './lineup-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  standalone: true,
  imports: [
    MatCardModule,
    NgIf,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgFor,
    MatOptionModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDividerModule,
    DatePipe,
    KeyValuePipe,
  ],
})
export class LineupOptionsComponent {
  public lineup = input.required<Partial<Lineup>>();
  public captain = input(true, { transform: booleanAttribute });
  public jolly = input(true, { transform: booleanAttribute });
  public disabled = input(false, { transform: booleanAttribute });
  protected readonly lineupService = inject(LineupService);
}
