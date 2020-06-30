export class Notification {
  public title: string;
  public url: string;
  public severity: number;

  constructor(title: string, url: string, severity = 0) {
    this.title = title;
    this.url = url;
    this.severity = severity;
  }
}
