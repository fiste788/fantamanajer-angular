import { Team } from '../../entities/team/team';

export class NotificationSubscription {
    id: number;
    type: string;
    name: string;
    enabled: boolean;
    team_id: number;
    team: Team;
}
