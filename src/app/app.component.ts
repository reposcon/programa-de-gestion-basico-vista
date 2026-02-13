import { Component } from '@angular/core';
import { UiMessageService, UiMessage } from './services/ui-message.service';
import { LoadingService } from './services/loading.service';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators'; // Importante

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  loading$: Observable<boolean>;
  message$: Observable<UiMessage | null>;

  constructor(
    private uiMessage: UiMessageService, 
    private loadingService: LoadingService
  ) {
    this.message$ = this.uiMessage.message$.pipe(delay(0));
    this.loading$ = this.loadingService.loading$.pipe(delay(0));
  }
}