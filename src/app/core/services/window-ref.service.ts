import { Injectable } from '@angular/core';

const _window = (): any => window;

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {
  get nativeWindow(): any {
    return _window();
  }
}
