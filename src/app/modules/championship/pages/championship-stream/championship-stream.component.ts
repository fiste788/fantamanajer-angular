import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '@app/services';

@Component({
  selector: 'fm-championship-stream',
  templateUrl: './championship-stream.component.html',
  styleUrls: ['./championship-stream.component.scss']
})
export class ChampionshipStreamComponent implements OnInit {
  id?: number;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = UtilService.getChampionshipId(this.route);
  }
}
