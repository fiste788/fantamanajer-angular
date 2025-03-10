import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { addVisibleClassOnDestroy } from '@app/functions';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  templateUrl: './home.page.html',
  imports: [RouterLink, MatCardModule],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HomePage {
  constructor() {
    addVisibleClassOnDestroy(cardCreationAnimation);
  }
}
