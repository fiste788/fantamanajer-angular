import { FormationArea } from './area.model'; // Utilizzo del nome dell'interfaccia modificato
import { Role } from './role.model';

export class Module {
  public label: string;
  public areas: Array<FormationArea>; // Utilizzo del nome dell'interfaccia modificato

  constructor(
    public key: string,
    roles: Array<Role>,
  ) {
    this.label = this.generateLabel(key); // Refactoring: estrazione logica label
    const moduleCounts = this.getModuleCounts(key); // Refactoring: estrazione logica conteggi

    this.areas = this.generateAreas(roles, moduleCounts); // Refactoring: estrazione logica aree
  }

  // Refactoring: metodo privato per generare la label
  private generateLabel(key: string): string {
    return key.slice(Math.max(0, key.indexOf('-') + 1));
  }

  // Refactoring: metodo privato per ottenere i conteggi dei moduli
  private getModuleCounts(key: string): Array<number> {
    return key.split('-').map((c) => +c);
  }

  // Refactoring: metodo privato per generare le aree
  private generateAreas(roles: Array<Role>, moduleCounts: Array<number>): Array<FormationArea> {
    // eslint-disable-next-line unicorn/no-array-reduce
    return [...roles].reduce((areasAccumulator, role, index) => { // Modifica nomenclatura accumulatore
      areasAccumulator.push({
        fromIndex: this.getStartIndexForArea(areasAccumulator), // Modifica nomenclatura metodo
        options: [],
        role,
        toIndex: moduleCounts[index] ?? 0, // Utilizzo del nome della variabile modificato
      });

      return areasAccumulator;
    }, new Array<FormationArea>()); // Tipizzazione esplicita per new Array
  }


  // Modifica suggerita per la nomenclatura del metodo
  public getStartIndexForArea(previousAreas: Array<FormationArea>): number { // Modifica nomenclatura parametro e tipo
    return previousAreas.reduce((p, v) => p + v.toIndex, 0);
  }
}
