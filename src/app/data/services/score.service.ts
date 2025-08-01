import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RecursivePartial } from '@app/types/recursive-partial.type';

import { RankingPosition, Score } from '../types';

import { LineupService } from './lineup.service';

const SCORES_URL_SEGMENT = 'scores'; // Modifica suggerita per la nomenclatura

const routes = {
  championshipRanking: (id: number) => `/championships/${id}/ranking`, // Modifica suggerita per la nomenclatura
  scoreById: (id: number) => `/${SCORES_URL_SEGMENT}/${id}`, // Modifica suggerita per la nomenclatura e consolidamento con 'update'
  teamScores: (teamId: number) => `/teams/${teamId}/${SCORES_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  lastTeamScore: (teamId: number) => `/teams/${teamId}/${SCORES_URL_SEGMENT}/last`, // Aggiunta rotta specifica per l'ultimo punteggio
};

@Injectable({ providedIn: 'root' })
export class ScoreService {
  readonly #http = inject(HttpClient);

  // Modifica suggerita per la nomenclatura e refactoring interno (rimozione duplicazione delete team)
  public static prepareScoreForApi(score: Score): RecursivePartial<Score> {
    const clonedScore = structuredClone(score);
    const cleanedScore: RecursivePartial<Score> = clonedScore;

    if (clonedScore.lineup) {
      // Assicurarsi che cleanLineup gestisca i casi null/undefined se necessario
      cleanedScore.lineup = LineupService.prepareLineupForApi(clonedScore.lineup as any); // Utilizzo del nome del metodo modificato in LineupService
      // La proprietà modules è già gestita in prepareLineupForApi
    }

    // Rimozione della duplicazione 'delete cleanedScore.team;'
    delete cleanedScore.team;


    return cleanedScore;
  }

  // Funzione privata per creare HttpParams con members (Refactoring suggerito)
  private createGetScoreParams(includeMembers = false): HttpParams | undefined {
    if (includeMembers) {
      return new HttpParams().set('members', '1');
    }
    return undefined;
  }


  public getChampionshipRanking(championshipId: number): Observable<Array<RankingPosition>> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Array<RankingPosition>>(routes.championshipRanking(championshipId)); // Utilizzo del nome della rotta modificato
  }

  public getScoreById(id: number, includeMembers = false): Observable<Score> { // Modifica suggerita per la nomenclatura e nome parametro
    const params = this.createGetScoreParams(includeMembers); // Utilizzo della funzione refactorizzata

    return this.#http.get<Score>(routes.scoreById(id), { params }); // Utilizzo del nome della rotta modificato
  }

  public getLastTeamScore(teamId: number): Observable<Score> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Score>(routes.lastTeamScore(teamId)); // Utilizzo della rotta centralizzata
  }

  public getScoresByTeam(teamId: number): Observable<Array<Score>> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Array<Score>>(routes.teamScores(teamId)); // Utilizzo del nome della rotta modificato
  }

  public updateScore(score: Score): Observable<Pick<Score, 'id'> > { // Modifica suggerita per la nomenclatura
    return this.#http.put<Pick<Score, 'id'> >(
      routes.scoreById(score.id), // Utilizzo del nome della rotta modificato (consolidato)
      ScoreService.prepareScoreForApi(score), // Utilizzo del nome del metodo modificato
    );
  }
}
