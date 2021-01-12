import { Component } from '@angular/core';

import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./home.page.scss'],
  templateUrl: './home.page.html',
})
export class HomePage {}
