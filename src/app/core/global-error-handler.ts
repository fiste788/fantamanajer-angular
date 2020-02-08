import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  async handleError(error: Error): Promise<never> {
    if (error !== undefined && error.message) {
      // const message = error.json().data.message;
      const message = error.message;
      console.error('An error occurred', message);

      return Promise.reject(message);
    }
    console.error(error);

    // IMPORTANT: Rethrow the error otherwise it gets swallowed
    throw error;
  }
}
