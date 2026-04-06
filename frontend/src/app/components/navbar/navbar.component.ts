import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <h1 class="title">✈️ Apron Management</h1>
        </div>
        <ul class="navbar-menu">
          <li>
            <a routerLink="/" class="nav-link">Dashboard</a>
          </li>
          <li>
            <a routerLink="/flight-plans" class="nav-link">Flight Plans</a>
          </li>
          <li>
            <a routerLink="/stands" class="nav-link">Stands</a>
          </li>
          <li>
            <a routerLink="/stand-assignments" class="nav-link">Assignments</a>
          </li>
          <li *ngIf="authService.isAdmin()">
            <a routerLink="/users" class="nav-link">👥 Users</a>
          </li>
        </ul>
        <div class="navbar-user" *ngIf="authService.currentUser() as user">
          <span class="user-info">
            <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
            <span class="user-role" *ngIf="user.role === 'admin'">(Admin)</span>
          </span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .navbar-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .navbar-menu {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: 2rem;
      }

      .nav-link {
        color: white;
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.3s;
      }

      .nav-link:hover {
        opacity: 0.8;
      }

      .navbar-user {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .user-name {
        font-weight: 500;
        opacity: 0.9;
      }

      .user-role {
        font-size: 0.75rem;
        opacity: 0.7;
      }

      .logout-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.3s;
      }

      .logout-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    `,
  ],
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
