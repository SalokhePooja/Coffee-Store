import { Component, inject } from '@angular/core';
import { LoadingService } from './core/services/loading.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Coffee Store';
  readonly loading = inject(LoadingService);
}
