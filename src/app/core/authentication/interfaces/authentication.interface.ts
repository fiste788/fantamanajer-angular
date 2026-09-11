import type { User } from '@data/interfaces'; // Importa User

export interface Authentication {
  token: string;
  user: User;
}
