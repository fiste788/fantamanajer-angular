import { Component } from '@angular/core';

import { cardCreationAnimation } from '@shared/animations';

@Component({
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  animations: [cardCreationAnimation]
})
export class HomePage {

}
