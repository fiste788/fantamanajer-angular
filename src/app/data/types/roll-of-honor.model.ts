import { Team } from './team.model';

// Interfaccia per un singolo elemento della classifica storica (Refactoring suggerito)
export interface RollOfHonorPosition {
  rank: number;
  points: number;
  team: Team;
  team_id: number; // Mantenuto snake_case per consistenza con il backend
  // Aggiungere altre proprietà qui se presenti nel backend, es. championship_id, matchday_id, season_id
  // championship?: Championship; // Esempio di relazione opzionale
}

export interface RollOfHonor {
  // Modifica suggerita per la nomenclatura e utilizzo dell'interfaccia separata
  roll_of_honor_entries: Array<RollOfHonorPosition>; // Nome più descrittivo per l'array
  // O mantenere roll_of_honor se riflette esattamente il nome del campo del backend
  // roll_of_honor: Array<RollOfHonorPosition>;
}
