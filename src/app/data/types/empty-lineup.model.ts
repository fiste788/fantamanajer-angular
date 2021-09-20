import { AtLeast } from '@app/types';
import { Lineup } from '.';

export type EmptyLineup = AtLeast<Lineup, 'team' | 'modules' | 'dispositions'>;
