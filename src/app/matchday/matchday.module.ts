import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatchdayService } from './matchday.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [MatchdayService]
})
export class MatchdayModule { }
