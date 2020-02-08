import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/shared/services/shared.service';

@Component({
  selector: 'fm-championship-stream',
  templateUrl: './championship-stream.component.html',
  styleUrls: ['./championship-stream.component.scss']
})
export class ChampionshipStreamComponent implements OnInit {

  id?: number;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = SharedService.getChampionshipId(this.route);
  }
}
