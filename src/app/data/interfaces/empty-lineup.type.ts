import type { AtLeast } from '@app/interfaces';

import type { Lineup } from './lineup.interface';

export type EmptyLineup = AtLeast<Lineup, 'dispositions' | 'modules' | 'team'>;
