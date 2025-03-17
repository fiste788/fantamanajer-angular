import { Injectable, computed, inject, linkedSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { TeamService } from '@data/services';
import { Team } from '@data/types';

@Injectable({
  providedIn: 'root',
})
export class TeamStoreService {
  readonly #authService = inject(AuthenticationService);
  readonly #teamService = inject(TeamService);
  readonly #team = linkedSignal<Team | undefined>(() => this.#authService.user()?.teams?.at(0), {
    equal: (a, b) => a?.id === b?.id,
  });
  public readonly team = this.#team.asReadonly();
  public readonly requireTeam = computed(() => this.team()!);

  public async changeTeam(team: Team): Promise<Team | undefined> {
    const res = await firstValueFrom(this.#teamService.getTeam(team.id), {
      defaultValue: undefined,
    });
    this.#team.set(res);

    return res;
  }
}
