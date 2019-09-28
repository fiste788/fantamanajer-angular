export class Notification {
  title: string;
  url: string;
  severity: number;

  constructor(title: string, url: string, severity?: number) {
    this.title = title;
    this.url = url;
    this.severity = severity;
  }
}
