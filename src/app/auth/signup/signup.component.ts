import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  providers: [AuthService],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Sign Up</h2>
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" formControlName="name" class="form-control">
            <div *ngIf="signupForm.get('name')?.errors?.['required'] && signupForm.get('name')?.touched" class="error-message">
              Name is required
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" formControlName="email" class="form-control">
            <div *ngIf="signupForm.get('email')?.errors?.['required'] && signupForm.get('email')?.touched" class="error-message">
              Email is required
            </div>
            <div *ngIf="signupForm.get('email')?.errors?.['email'] && signupForm.get('email')?.touched" class="error-message">
              Please enter a valid email
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="password" class="form-control">
            <div *ngIf="signupForm.get('password')?.errors?.['required'] && signupForm.get('password')?.touched" class="error-message">
              Password is required
            </div>
            <div *ngIf="signupForm.get('password')?.errors?.['minlength'] && signupForm.get('password')?.touched" class="error-message">
              Password must be at least 6 characters
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary" [disabled]="signupForm.invalid || isLoading">
            {{ isLoading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>
        
        <p class="auth-link">
          Already have an account? <a routerLink="/auth/login">Login</a>
        </p>
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
      background-color: var(--gray-50);
    }
    
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: var(--primary-color);
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--gray-700);
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
    
    .btn {
      width: 100%;
      margin-top: 1rem;
    }
    
    .auth-link {
      text-align: center;
      margin-top: 1.5rem;
      color: var(--gray-600);
      
      a {
        color: var(--primary-color);
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => {
          this.router.navigate(['/recipes']);
        },
        error: (error) => {
          console.error('Signup error:', error);
          this.isLoading = false;
        }
      });
    }
  }
}
