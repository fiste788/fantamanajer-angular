import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { addVisibleClassOnDestroy } from '@app/functions';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  styleUrl: './home.page.scss',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [RouterLink, MatCardModule],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HomePage {
  constructor() {
    addVisibleClassOnDestroy(cardCreationAnimation);
  }
}
