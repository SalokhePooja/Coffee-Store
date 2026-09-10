import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  readonly snackbar = inject(SnackbarService);
}
