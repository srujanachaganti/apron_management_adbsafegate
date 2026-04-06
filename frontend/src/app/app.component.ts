import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar *ngIf="authService.isAuthenticated()"></app-navbar>
    <main [class.container]="authService.isAuthenticated()">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Apron Management System';

  constructor(public authService: AuthService) {}
}
