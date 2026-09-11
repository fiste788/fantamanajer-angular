import { AtLeast } from '@app/types';

import { Lineup } from './lineup.model';

export type EmptyLineup = AtLeast<Lineup, 'dispositions' | 'modules' | 'team'>;
