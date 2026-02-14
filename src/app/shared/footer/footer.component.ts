import { Component } from '@angular/core';
import { APP_VERSION } from '../../../environments/version'

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  appVersion: string = APP_VERSION;
  currentYear: number = new Date().getFullYear();

}
