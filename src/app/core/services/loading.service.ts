import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pendingRequests = signal(0);

  /**
   *   Expose whether at least one request is currently pending.
   */
  readonly isLoading = computed(() => this.pendingRequests() > 0);

  /**
   *   Record the start of a request.
   */
  start(): void {
    this.pendingRequests.update((count) => count + 1);
  }

  /**
   *   Record the completion of a request without going below zero.
   */
  stop(): void {
    this.pendingRequests.update((count) => Math.max(0, count - 1));
  }
}
