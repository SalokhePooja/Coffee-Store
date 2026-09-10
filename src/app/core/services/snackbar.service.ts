import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  readonly message = signal('');
  readonly type = signal<'success' | 'error'>('success');

  show(message: string, type: 'success' | 'error' = 'success'): void {
    this.type.set(type);
    this.message.set(message);
    setTimeout(() => {
      this.message.set('');
    }, 5000);
  }

  clear(): void {
    this.message.set('');
  }
}
