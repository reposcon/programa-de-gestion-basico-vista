import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UiMessage {
  text: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}


@Injectable({ providedIn: 'root' })
export class UiMessageService {

  private messageSubject = new BehaviorSubject<UiMessage | null>(null);
  message$ = this.messageSubject.asObservable();

  show(text: string, type: UiMessage['type'] = 'warning'): void {
    this.messageSubject.next({ text, type });

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  clear(): void {
    this.messageSubject.next(null);
  }
}
