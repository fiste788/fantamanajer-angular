import { Component, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { MemberService, ApplicationService } from '@app/core/services';
import { Role } from '@app/core/models';
import { CardCreationAnimation } from '@app/core/animations';


@Component({
  selector: 'fm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [CardCreationAnimation]
})
export class HomeComponent implements OnInit {
  @HostBinding('@cardCreationAnimation') CardCreationAnimation = '';
  public roles: Observable<Role[]>;
  constructor(private memberService: MemberService, public app: ApplicationService) { }

  ngOnInit() {
    this.roles = this.memberService.getBest().pipe(share());
  }
}
