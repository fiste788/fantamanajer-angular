import { NgModule } from '@angular/core';

import { ArticleModule } from './article/article.module';
import { ChampionshipModule } from './championship/championship.module';
import { ClubModule } from './club/club.module';
import { DispositionModule } from './disposition/disposition.module';
import { EventModule } from './event/event.module';
import { LeagueModule } from './league/league.module';
import { LineupModule } from './lineup/lineup.module';
import { MatchdayModule } from './matchday/matchday.module';
import { MemberModule } from './member/member.module';
import { NotificationModule } from './notification/notification.module';
import { PlayerModule } from './player/player.module';
import { RatingModule } from './rating/rating.module';
import { RoleModule } from './role/role.module';
import { ScoreModule } from './score/score.module';
import { SeasonModule } from './season/season.module';
import { SelectionModule } from './selection/selection.module';
import { PushSubscriptionModule } from './push-subscription/push-subscription.module';
import { TeamModule } from './team/team.module';
import { TransfertModule } from './transfert/transfert.module';

@NgModule({
  imports: [
    ArticleModule,
    ChampionshipModule,
    ClubModule,
    DispositionModule,
    EventModule,
    LeagueModule,
    LineupModule,
    MatchdayModule,
    MemberModule,
    NotificationModule,
    PlayerModule,
    RatingModule,
    RoleModule,
    ScoreModule,
    SeasonModule,
    SelectionModule,
    PushSubscriptionModule,
    TeamModule,
    TransfertModule
  ],
})
export class EntitiesModule { }
