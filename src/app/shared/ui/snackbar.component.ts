import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SnackbarService } from './snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar" [class.error]="snackbar.type() === 'error'" *ngIf="snackbar.message()">
      {{ snackbar.message() }}
    </div>
  `,
  styles: [`
    .snackbar {
      position: fixed;
      right: 1.5rem;
      bottom: 1.5rem;
      z-index: 1000;
      border-radius: 12px;
      padding: 0.85rem 1rem;
      background: #eaf8ee;
      color: #165c35;
      box-shadow: 0 8px 24px rgba(45, 27, 18, 0.18);
      font-weight: 600;
    }

    .snackbar.error {
      background: #fdeceb;
      color: #9b2c2c;
    }
  `],
})
export class SnackbarComponent {
  constructor(readonly snackbar: SnackbarService) {}
}
