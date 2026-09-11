import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatCardModule, RouterLink],
  templateUrl: './home.page.html',
})
export class HomePage {}
