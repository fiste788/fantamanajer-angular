import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@angular/material';
import { MdIconModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedService } from './shared.service';
import { MemberModule } from '../member/member.module';
import { DispositionModule } from '../disposition/disposition.module';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    MdIconModule,
    FormsModule,
    HttpModule,
    CommonModule,
    FlexLayoutModule,
    MemberModule,
    DispositionModule
  ],
  declarations: [],
  // providers: [SharedService]
})
export class SharedModule { }
