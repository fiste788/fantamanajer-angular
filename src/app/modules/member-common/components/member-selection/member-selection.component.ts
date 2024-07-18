/* eslint-disable unicorn/no-null */
import { NgIf, NgFor, DecimalPipe, KeyValuePipe } from '@angular/common';
import {
  Component,
  HostBinding,
  booleanAttribute,
  input,
  model,
  numberAttribute,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Member, MemberOption, Role } from '@data/types';
import { createBoxAnimation, lineupDispositionAnimation } from '@shared/animations';
import { PlayerImageComponent } from '@shared/components/player-image';

import { MemberIconsComponent } from '../member-icons/member-icons.component';

@Component({
  animations: [lineupDispositionAnimation, createBoxAnimation],
  selector: 'app-member-selection[member][name]',
  styleUrl: './member-selection.component.scss',
  templateUrl: './member-selection.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    PlayerImageComponent,
    NgIf,
    MemberIconsComponent,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    NgFor,
    DecimalPipe,
    KeyValuePipe,
  ],
})
export class MemberSelectionComponent {
  @HostBinding('@lineupDisposition') protected lineupDisposition = '';
  public member = model.required<Member | null>();
  public name = input.required<string>();
  public disabled = input(false, { transform: booleanAttribute });
  public required = input(false, { transform: booleanAttribute });
  public placeholder = input('');
  public memberList = input<Array<MemberOption>>([]);
  public memberMap = input<Map<Role, Array<MemberOption>>>();
  public size = input(100, { transform: numberAttribute });
  public width = input(100, { transform: numberAttribute });
  public height = input(100, { transform: numberAttribute });
  public captain = input(false, { transform: booleanAttribute });

  public compareFn(t1: Member | null, t2: Member | null): boolean {
    return t1?.id === t2?.id;
  }
}
