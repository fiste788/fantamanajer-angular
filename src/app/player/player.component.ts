import { Member } from '../member/member';
import { Season } from '../season/season';
import { SharedService } from '../shared/shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { Player } from './player';
import { PlayerService } from './player.service';

@Component({
  selector: 'fm-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  player: Player;
  season: Season;
  selectedMember: Member;

  constructor(public snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.season = this.sharedService.currentChampionship.season;
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.playerService.getPlayer(id).then(player => {
      this.player = player;
      this.selectedMember = player.members[0];
      this.sharedService.pageTitle = player.name + ' ' + player.surname;
    });
  }

}
