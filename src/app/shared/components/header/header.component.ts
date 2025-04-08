import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <nav class="container">
        <div class="flex justify-between items-center">
          <a routerLink="/" class="logo">Flavor Exchange</a>
          
          <div class="nav-links">
            <a routerLink="/recipes" routerLinkActive="active" 
               class="nav-link">
              Recipes
            </a>
            
            <ng-container *ngIf="authService.currentUser$ | async as user; else loginButtons">
              <a routerLink="/favorites" routerLinkActive="active"
                 class="nav-link">
                Favorites
              </a>
              <button (click)="authService.logout()"
                      class="btn btn-primary">
                Logout
              </button>
            </ng-container>
            
            <ng-template #loginButtons>
              <a routerLink="/auth/login" routerLinkActive="active"
                 class="nav-link">
                Login
              </a>
              <a routerLink="/auth/signup" routerLinkActive="active"
                 class="nav-link">
                Sign Up
              </a>
            </ng-template>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .flex {
      display: flex;
    }

    .justify-between {
      justify-content: space-between;
    }

    .items-center {
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color);
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-link {
      color: var(--gray-700);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        color: var(--primary-color);
      }

      &.active {
        color: var(--primary-color);
      }
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;

      &.btn-primary {
        background-color: var(--primary-color);
        color: white;

        &:hover {
          background-color: var(--primary-dark);
        }
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}
