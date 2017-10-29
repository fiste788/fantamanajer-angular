import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error) {
    if (error && error.message) {
      // const message = error.json().data.message;
      const message = error.message;
      console.error('An error occurred', message);
      return Promise.reject(message);
    } else {
      console.error(error);
    }
    // IMPORTANT: Rethrow the error otherwise it gets swallowed
    throw error;
  }
}
