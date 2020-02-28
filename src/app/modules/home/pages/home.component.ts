import { Component, HostBinding, OnInit } from '@angular/core';
import { MemberService } from '@app/http';
import { ApplicationService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { Member, Role } from '@shared/models';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Component({
  selector: 'fm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [cardCreationAnimation]
})
export class HomeComponent implements OnInit {
  @HostBinding('@cardCreationAnimation') cardCreationAnimation = '';
  roles: Observable<Array<Role>>;

  constructor(
    private readonly memberService: MemberService,
    public app: ApplicationService
  ) { }

  ngOnInit(): void {
    this.roles = this.memberService.getBest()
      .pipe(share());
  }

  track(_: number, item: Member): number {
    return item.id; // or item.id
  }
}
