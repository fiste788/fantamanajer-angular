import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import type { ResourceRef } from '@angular/core';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { RecursivePartial } from '@app/interfaces';

import { LineupService } from './lineup.service';

import type { RankingPosition, Score } from '../interfaces';

const scoresUrlSegment = 'scores'; // Modifica suggerita per la nomenclatura

const routes = {
  championshipRanking: (id: number) => `/championships/${id}/ranking`, // Modifica suggerita per la nomenclatura
  lastTeamScore: (teamId: number) => `/teams/${teamId}/${scoresUrlSegment}/last`, // Aggiunta rotta specifica per l'ultimo punteggio
  scoreById: (id: number) => `/${scoresUrlSegment}/${id}`, // Modifica suggerita per la nomenclatura e consolidamento con 'update'
  teamScores: (teamId: number) => `/teams/${teamId}/${scoresUrlSegment}`, // Modifica suggerita per la nomenclatura
};

@Service()
export class ScoreService {

  readonly #http = inject(HttpClient);

  public getChampionshipRanking(championshipId: number): Observable<RankingPosition[]> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<RankingPosition[]>(routes.championshipRanking(championshipId)); // Utilizzo del nome della rotta modificato
  }

  public getLastTeamScore(teamId: number): Observable<Score> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Score>(routes.lastTeamScore(teamId)); // Utilizzo della rotta centralizzata
  }

  public getScoreById(id: number, isIncludeMembers = false): Observable<Score> {
    // Modifica suggerita per la nomenclatura e nome parametro
    const parameters = this.#createGetScoreParams(isIncludeMembers); // Utilizzo della funzione refactorizzata

    return this.#http.get<Score>(routes.scoreById(id), { params: parameters }); // Utilizzo del nome della rotta modificato
  }

  public getScoreResourceById(score: () => Score | undefined, isIncludeMembers = false): ResourceRef<Score | undefined> {
    // Modifica suggerita per la nomenclatura e nome parametro
    const parameters = this.#createGetScoreParams(isIncludeMembers); // Utilizzo della funzione refactorizzata

    return httpResource(() => {
      const scoreValue = score();

      if (scoreValue === undefined) {
        return scoreValue;
      }

      // Costruiamo l'oggetto richiesta rispettando rigorosamente il tipo ed evitando params: undefined
      const request = { params: parameters, url: routes.scoreById(scoreValue.id) };

      return request;
    }); // Utilizzo del nome della rotta modificato
  }

  public getScoresByTeam(teamId: number): Observable<Score[]> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Score[]>(routes.teamScores(teamId)); // Utilizzo del nome della rotta modificato
  }

  // Modifica suggerita per la nomenclatura e refactoring interno (rimozione duplicazione delete team)
  public static prepareScoreForApi(score: Score): RecursivePartial<Score> {
    const clonedScore = structuredClone(score);
    const cleanedScore: RecursivePartial<Score> = clonedScore;

    if (clonedScore.lineup) {
      // Assicurarsi che cleanLineup gestisca i casi null/undefined se necessario
      cleanedScore.lineup = LineupService.prepareLineupForApi(clonedScore.lineup); // Utilizzo del nome del metodo modificato in LineupService
      // La proprietà modules è già gestita in prepareLineupForApi
    }

    // Rimozione della duplicazione 'delete cleanedScore.team;'
    delete cleanedScore.team;

    return cleanedScore;
  }

  public updateScore(score: Score): Observable<Pick<Score, 'id'>> {
    // Modifica suggerita per la nomenclatura
    return this.#http.put<Pick<Score, 'id'>>(
      routes.scoreById(score.id), // Utilizzo del nome della rotta modificato (consolidato)
      ScoreService.prepareScoreForApi(score), // Utilizzo del nome del metodo modificato
    );
  }

  // Funzione privata per creare HttpParams con members (Refactoring suggerito)
  #createGetScoreParams(isIncludeMembers = false): HttpParams {
    const parameters = new HttpParams();
    if (isIncludeMembers) {
      return parameters.set('members', '1');
    }

    return parameters;
  }

}
