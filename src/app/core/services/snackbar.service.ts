import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  readonly message = signal('');
  readonly type = signal<'success' | 'error'>('success');

  /**
   *   Display a message and clear it after the display interval.
   * @param message 
   * @param type 
   */
  show(message: string, type: 'success' | 'error' = 'success'): void {
    this.type.set(type);
    this.message.set(message);
    // Clear the message when its display interval expires.
    setTimeout(() => {
      this.message.set('');
    }, 5000);
  }

  /**
   *   Immediately hide the currently displayed message.
   */
  clear(): void {
    this.message.set('');
  }
}
