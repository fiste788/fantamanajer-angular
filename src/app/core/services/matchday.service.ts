import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
export const WS_ENDPOINT = ''; //environment.wsEndpoint || '';

@Injectable({
  providedIn: 'root',
})
export class MatchdayService {
  public messages$;
  private socket$?: WebSocketSubject<unknown>;
  private readonly messagesSubject$ = new Subject();

  constructor() {
    this.messages$ = this.messagesSubject$.pipe(
      switchAll(),
      catchError((e: unknown) => {
        throw e;
      }),
    );
  }

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(
        tap({
          error: (error) => console.log(error),
        }),
        catchError((_) => EMPTY),
      );
      this.messagesSubject$.next(messages);
    }
  }

  sendMessage(msg: any) {
    if (this.socket$) {
      this.socket$.next(msg);
    }
  }
  close() {
    if (this.socket$) {
      this.socket$.complete();
    }
  }

  private getNewWebSocket() {
    return webSocket(WS_ENDPOINT);
  }
}
