export class Module {
  key: string;
  label: string;
  map: Map<string, number[]>;

  constructor(key: string) {
    if (key) {
      this.key = key;
      this.label = key.substring(key.indexOf('-') + 1);
      this.map = new Map<string, number[]>();
      const arr = key.split('-');
      arr.forEach(function(element, index) {
        const players = parseInt(element, 10);
        const array = Array(players).fill(players).map((x, i) => i)
        if (index === 0) {
          this.map.set('P', array);
        } else if (index === 1) {
          this.map.set('D', array);
        } else if (index === 2) {
          this.map.set('C', array);
        } else if (index === 3) {
          this.map.set('A', array);
        }
      }, this);
    }
  }
}
