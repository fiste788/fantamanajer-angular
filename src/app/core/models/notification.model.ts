export class Notification {
  title: string;
  url: string;
  severity: number;

  constructor(title: string, url: string, severity = 0) {
    this.title = title;
    this.url = url;
    this.severity = severity;
  }
}
