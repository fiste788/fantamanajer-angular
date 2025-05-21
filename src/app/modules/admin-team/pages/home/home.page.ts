import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  templateUrl: './home.page.html',
  imports: [RouterLink, MatCardModule],
})
export class HomePage {}
