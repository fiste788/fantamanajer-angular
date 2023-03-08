import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./home.page.scss'],
  templateUrl: './home.page.html',
  standalone: true,
  imports: [RouterLink, MatCardModule],
})
export class HomePage {}
