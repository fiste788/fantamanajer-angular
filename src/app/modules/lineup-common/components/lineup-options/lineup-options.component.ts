import { NgIf, NgFor, DatePipe, KeyValuePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, booleanAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  @Input({ required: true }) public lineup!: Partial<Lineup>;
  @Input({ transform: booleanAttribute }) public disabled = false;

  constructor(protected readonly lineupService: LineupService) {}
}
