import { Component } from '@angular/core';
import { cardCreationAnimation } from '@app/shared/animations';

@Component({
  selector: 'fm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [cardCreationAnimation]
})
export class HomeComponent {

}
