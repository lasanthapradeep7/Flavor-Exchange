import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe.model';
import { AuthService } from '../../core/services/auth.service';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, RecipeCardComponent],
  template: `
    <div class="recipe-list-container">
      <div class="recipe-list-header">
        <h1>Recipes</h1>
        <button *ngIf="authService.isAuthenticated()" 
                routerLink="/recipes/new" 
                class="btn btn-primary">
          + Add Recipe
        </button>
      </div>

      <div class="search-container">
        <input type="text" 
               [formControl]="searchControl"
               class="search-input" 
               placeholder="Search recipes...">
      </div>

      <div class="recipe-grid">
        <app-recipe-card
          *ngFor="let recipe of recipes"
          [recipe]="recipe"
          (click)="navigateToRecipe(recipe.id)">
        </app-recipe-card>
      </div>
    </div>
  `,
  styles: [`
    .recipe-list-container {
      padding: var(--spacing-4);
      max-width: 1200px;
      margin: 0 auto;
    }

    .recipe-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        color: var(--gray-900);
      }
    }

    .search-container {
      margin-bottom: 2rem;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--gray-300);
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
      }
    }

    .recipe-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .btn-primary {
      background-color: var(--primary-color);
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--primary-dark);
      }
    }
  `]
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  searchControl = new FormControl('');

  constructor(
    private recipeService: RecipeService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Initialize with all recipes
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
    });

    // Setup search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.recipeService.searchRecipes(query || ''))
    ).subscribe(recipes => {
      this.recipes = recipes;
    });
  }

  navigateToRecipe(id: string) {
    // This will be handled by the RouterLink directive
  }
}
