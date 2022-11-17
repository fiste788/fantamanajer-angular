import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { httpErrorInterceptorProvider } from './http-error.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [httpErrorInterceptorProvider],
})
export class ErrorHandlerModule {}
