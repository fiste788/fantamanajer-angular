import { NoopScrollStrategy } from '@angular/cdk/overlay';
import type { OnInit } from '@angular/core';
import { afterNextRender, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '@app/authentication';
import { AppService, ScrollService, WINDOW } from '@app/services';
import type { Tab, Team, User } from '@data/interfaces';
import { ParallaxHeaderComponent } from '@shared/components/parallax-header';
import { PrimaryTabComponent } from '@shared/components/primary-tab/primary-tab.component';

import { TeamEditModal } from '../../components/modals/team-edit/team-edit.modal';

@Component({
  imports: [MatButtonModule, MatDialogModule, MatIconModule, ParallaxHeaderComponent, PrimaryTabComponent],
  templateUrl: './team-detail.page.html',
  styleUrl: './team-detail.page.scss',
})
export class TeamDetailPage implements OnInit {

  readonly #dialog = inject(MatDialog);
  readonly #scrollService = inject(ScrollService);
  readonly #window = inject<Window>(WINDOW);
  protected readonly app = inject(AppService);
  protected readonly auth = inject(AuthenticationService);

  public readonly team = input.required<Team>();

  protected placeholder?: string;

  protected readonly tabs = computed(() => this.loadTabs(this.team(), this.app.seasonEnded(), this.app.currentTeam(), this.auth.currentUser()));

  constructor() {
    afterNextRender(() => {
      this.placeholder = this.#window.history.state?.img;
    });
  }

  public ngOnInit(): void {
    if (this.team().championship.season_id !== this.app.currentMatchday()?.season_id && this.team().user_id === this.auth.currentUser()?.id) {
      void this.app.changeTeam(this.team());
    }
  }

  public loadTabs(currentTeam: Team, isSeasonEnded = false, team?: Team, user?: User): Tab[] {
    const { started } = currentTeam.championship;

    return [
      { label: 'Giocatori', link: 'players' },
      {
        hidden: isSeasonEnded || !started,
        label: 'Formazione',
        link: 'lineup/current',
      },
      {
        hidden: !started,
        label: 'Ultima giornata',
        link: 'scores/last',
      },
      {
        hidden: isSeasonEnded || !started,
        label: 'Trasferimenti',
        link: 'transferts',
      },
      { label: 'Articoli', link: 'articles' },
      { label: 'Attività', link: 'stream' },
      { hidden: !(user?.admin ?? team?.admin), label: 'Admin', link: 'admin' },
    ];
  }

  protected openDialog(team: Team): void {
    this.#dialog.open<TeamEditModal, Team, boolean>(TeamEditModal, {
      data: team,
      scrollStrategy: new NoopScrollStrategy(),
    });
  }

  protected scrollTo(height: number): void {
    this.#scrollService.scrollTo(0, height - 300);
  }

}
