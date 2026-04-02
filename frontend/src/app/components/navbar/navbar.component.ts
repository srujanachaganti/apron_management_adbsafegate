import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
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
        </ul>
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
    `,
  ],
})
export class NavbarComponent {}
