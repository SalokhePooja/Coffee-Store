import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  readonly message = signal('');
  readonly type = signal<'success' | 'error'>('success');

  show(message: string, type: 'success' | 'error' = 'success'): void {
    this.type.set(type);
    this.message.set(message);
  }

  clear(): void {
    this.message.set('');
  }
}
