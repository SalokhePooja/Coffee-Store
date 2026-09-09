import { Component } from '@angular/core';
import { LoadingService } from './core/services/loading.service';
import { SnackbarComponent } from './shared/ui/snackbar.component';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SnackbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Coffee Store';

  constructor(readonly loading: LoadingService) {}
}
