import { Component, OnInit } from '@angular/core';
import { CardCreationAnimation } from '../../../shared/animations/card-creation.animation';

@Component({
  selector: 'fm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [CardCreationAnimation]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
