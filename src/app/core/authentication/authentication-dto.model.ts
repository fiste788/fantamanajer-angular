import { User } from '@data/types';

export interface AuthenticationDto {
  user: User;
  token: string;
}
