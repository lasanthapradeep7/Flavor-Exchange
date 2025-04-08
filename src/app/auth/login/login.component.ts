import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Login to Flavor Exchange</h1>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" formControlName="email" class="form-control">
            <div class="error-message" *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched">
              Email is required
            </div>
            <div class="error-message" *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched">
              Please enter a valid email
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="password" class="form-control">
            <div class="error-message" *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched">
              Password is required
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>

        <div class="auth-links">
          <p>Don't have an account? <a routerLink="/auth/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 2rem;
      background-color: var(--gray-100);
    }

    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;

      h1 {
        margin-bottom: 2rem;
        color: var(--gray-900);
        font-size: 1.5rem;
        text-align: center;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--gray-700);
        font-weight: 500;
      }
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--gray-300);
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
      }
    }

    .error-message {
      color: var(--error-color);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      margin-top: 2rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;

      &.btn-primary {
        background-color: var(--primary-color);
        color: white;

        &:hover {
          background-color: var(--primary-dark);
        }

        &:disabled {
          background-color: var(--gray-400);
          cursor: not-allowed;
        }
      }
    }

    .auth-links {
      margin-top: 1.5rem;
      text-align: center;
      color: var(--gray-600);

      a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/recipes']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isSubmitting = false;
      }
    });
  }
}
