import { Component } from '@angular/core';
import { UiMessageService } from './services/ui-message.service';
import { Observable } from 'rxjs';
import { UiMessage } from './services/ui-message.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  loading$: Observable<boolean>;
  message$!: Observable<UiMessage | null>;

  constructor(private uiMessage: UiMessageService, private loadingService: LoadingService) {
    this.message$ = this.uiMessage.message$;
    this.loading$ = this.loadingService.loading$;
  }
}
