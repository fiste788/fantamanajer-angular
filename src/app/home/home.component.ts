import { Component, OnInit } from '@angular/core';
import { MemberService } from '../entities/member/member.service';
import { Role } from '../entities/role/role';
import { Observable } from 'rxjs';
import { CardCreationAnimation } from '../shared/animations/card-creation.animation';

import { share } from 'rxjs/operators';

@Component({
  selector: 'fm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    CardCreationAnimation
  ]
})
export class HomeComponent implements OnInit {
  public roles: Observable<Role[]>;
  constructor(private memberService: MemberService) { }

  ngOnInit() {
    this.roles = this.memberService.getBest().pipe(share());
  }
}
