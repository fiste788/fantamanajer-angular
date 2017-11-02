import { Component, OnInit } from '@angular/core';
import { MemberService } from '../member/member.service';
import { Role } from '../role/role';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';

@Component({
  selector: 'fm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public roles: Observable<Role[]>;
  constructor(private memberService: MemberService) {}

  ngOnInit() {
    this.roles = this.memberService.getBest().share();
  }
}
