import { Member } from '../member/member';
import { User } from '../../user/user';
import { Championship } from '../championship/championship';

export class Team {
  id: number;
  name: string;
  user_id: number;
  user: User;
  members: Member[];
  championship_id: number;
  championship: Championship;
  photo_url: string;
}
