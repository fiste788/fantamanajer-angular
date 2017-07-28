import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fm-parallax-header',
  templateUrl: './parallax-header.component.html',
  styleUrls: ['./parallax-header.component.scss']
})
export class ParallaxHeaderComponent implements OnInit {

  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public image: string;
  @Input() public backgroundImage: string;
  @Input() public tabs: any[] = [];
  constructor() { }

  ngOnInit() {
  }

}
