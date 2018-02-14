import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { RellaxDirective } from '../rellax/rellax.directive';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'fm-parallax-header',
  templateUrl: './parallax-header.component.html',
  styleUrls: ['./parallax-header.component.scss']
})
export class ParallaxHeaderComponent implements OnInit, AfterViewInit {
  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public image: string;
  @Input() public backgroundImage: any;
  // @Input() public backgroundUrls: any;
  @Input() public tabs: any[] = [];
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public srcset = '';
  public width = 0;
  constructor() { }

  ngOnInit() {
    if (this.backgroundImage) {
      if (typeof this.backgroundImage !== 'string') {
        const srcset = [];
        const keys = Object.keys(this.backgroundImage);
        keys.forEach(key => {
          srcset.push(this.backgroundImage[key] + ' ' + key);
        });
        this.srcset = srcset.join(',');
        const lastKey = keys.pop();
        this.backgroundImage = this.backgroundImage[lastKey];
        this.width = parseInt(lastKey.substring(0, lastKey.indexOf('w')), 10);
      }
    }
  }

  ngAfterViewInit() {
    this.tabGroup.selectedIndex = this.tabs.findIndex((value) => location.href.includes(value.link));
  }
}
