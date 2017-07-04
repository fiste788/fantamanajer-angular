import { Member } from '../member/member';
import { User } from '../user/user';


export class Team {
  id: number;
  name: string;
  user_id: number;
  user: User;
  members: Member[];
  championship_id: number;
}
