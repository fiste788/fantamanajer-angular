import { AtLeast } from '@app/types';

import { Lineup } from './lineup.model';

export type EmptyLineup = AtLeast<Lineup, 'team' | 'modules' | 'dispositions'>;
