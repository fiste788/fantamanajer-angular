import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '@app/core/services';

@Component({
  selector: 'fm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],

})
export class ToolbarComponent implements OnInit {

  @Output() clickToggleNav = new EventEmitter<any>();

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  clickNav() {
    this.clickToggleNav.emit();
  }

}
