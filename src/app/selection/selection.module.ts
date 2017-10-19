import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SelectionComponent } from './selection/selection.component';
import { SelectionService } from './selection.service';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [SelectionComponent],
  declarations: [SelectionComponent],
  providers: [SelectionService]
})
export class SelectionModule { }
