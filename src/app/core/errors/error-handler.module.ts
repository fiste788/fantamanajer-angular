import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { globalErrorHandlerProvider } from './global-error-handler';
import { httpErrorInterceptorProvider } from './http-error.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [globalErrorHandlerProvider, httpErrorInterceptorProvider],
})
export class ErrorHandlerModule {}
