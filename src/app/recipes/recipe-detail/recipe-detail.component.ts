import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeService } from '../../core/services/recipe.service';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="recipe-detail-container" *ngIf="recipe; else loading">
      <div class="recipe-header">
        <h1>{{ recipe.title }}</h1>
        <div class="recipe-actions" *ngIf="isAuthor">
          <button class="btn btn-secondary" [routerLink]="['/recipes', recipe.id, 'edit']">
            <i class="fas fa-edit"></i> Edit Recipe
          </button>
          <button class="btn btn-danger" (click)="deleteRecipe()">
            <i class="fas fa-trash"></i> Delete Recipe
          </button>
        </div>
      </div>

      <div class="recipe-image">
        <img [src]="recipe.imageUrl" [alt]="recipe.title">
      </div>

      <div class="recipe-meta">
        <div class="meta-item">
          <i class="fas fa-clock"></i>
          <span>{{ recipe.cookingTime }} minutes</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-users"></i>
          <span>{{ recipe.servings }} servings</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-star"></i>
          <span>{{ recipe.rating | number:'1.1-1' }}</span>
        </div>
        <button class="btn" [class.btn-primary]="!isFavorite" [class.btn-secondary]="isFavorite" (click)="toggleFavorite()">
          <i class="fas" [class.fa-heart]="isFavorite" [class.fa-heart-o]="!isFavorite"></i>
          {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
        </button>
      </div>

      <div class="recipe-description">
        <p>{{ recipe.description }}</p>
      </div>

      <div class="recipe-section">
        <h2>Ingredients</h2>
        <ul class="ingredients-list">
          <li *ngFor="let ingredient of recipe.ingredients">
            <span class="amount">{{ ingredient.amount }} {{ ingredient.unit }}</span>
            <span class="name">{{ ingredient.name }}</span>
            <span class="notes" *ngIf="ingredient.notes">({{ ingredient.notes }})</span>
          </li>
        </ul>
      </div>

      <div class="recipe-section">
        <h2>Instructions</h2>
        <ol class="instructions-list">
          <li *ngFor="let instruction of recipe.instructions">{{ instruction }}</li>
        </ol>
      </div>

      <div class="recipe-section" *ngIf="recipe.tags?.length">
        <h2>Tags</h2>
        <div class="tags-container">
          <span class="tag" *ngFor="let tag of recipe.tags">{{ tag }}</span>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading recipe...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .recipe-detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    .recipe-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        color: var(--gray-900);
        font-size: 2.5rem;
      }
    }

    .recipe-actions {
      display: flex;
      gap: 1rem;
    }

    .recipe-image {
      margin-bottom: 2rem;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      img {
        width: 100%;
        height: 400px;
        object-fit: cover;
      }
    }

    .recipe-meta {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: var(--gray-100);
      border-radius: 8px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--gray-700);

        i {
          color: var(--primary-color);
        }
      }
    }

    .recipe-description {
      margin-bottom: 2rem;
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--gray-700);
    }

    .recipe-section {
      margin-bottom: 2rem;

      h2 {
        color: var(--gray-900);
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }
    }

    .ingredients-list {
      list-style: none;
      padding: 0;

      li {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--gray-200);

        .amount {
          color: var(--primary-color);
          font-weight: 500;
          min-width: 100px;
        }

        .name {
          flex: 1;
        }

        .notes {
          color: var(--gray-600);
          font-style: italic;
        }
      }
    }

    .instructions-list {
      padding-left: 1.5rem;

      li {
        margin-bottom: 1rem;
        line-height: 1.6;
        color: var(--gray-800);
      }
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .tag {
        padding: 0.25rem 0.75rem;
        background-color: var(--primary-light);
        color: var(--primary-color);
        border-radius: 16px;
        font-size: 0.875rem;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: var(--gray-600);

      i {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &.btn-primary {
        background-color: var(--primary-color);
        color: white;

        &:hover {
          background-color: var(--primary-dark);
        }
      }

      &.btn-secondary {
        background-color: var(--gray-200);
        color: var(--gray-700);

        &:hover {
          background-color: var(--gray-300);
        }
      }

      &.btn-danger {
        background-color: var(--error-color);
        color: white;

        &:hover {
          background-color: var(--error-dark);
        }
      }

      i {
        font-size: 1rem;
      }
    }

    @media (max-width: 768px) {
      .recipe-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .recipe-meta {
        flex-direction: column;
        align-items: flex-start;
      }

      .recipe-image img {
        height: 300px;
      }
    }
  `]
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  isAuthor = false;
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    
    this.route.params.pipe(
      switchMap(params => this.recipeService.getRecipeById(params['id'])),
      tap(recipe => {
        if (!recipe) {
          this.router.navigate(['/recipes']);
          return;
        }
        this.recipe = recipe;
        this.isAuthor = currentUser?.id === recipe.authorId;
        
        if (currentUser) {
          this.favoritesService.isFavorite(recipe.id).subscribe(
            isFavorite => this.isFavorite = isFavorite
          );
        }
      }),
      catchError(error => {
        console.error('Error loading recipe:', error);
        this.router.navigate(['/recipes']);
        return of(null);
      })
    ).subscribe();
  }

  toggleFavorite() {
    if (!this.recipe || !this.authService.getCurrentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    const observable = this.isFavorite
      ? this.favoritesService.removeFavorite(this.recipe.id)
      : this.favoritesService.addFavorite(this.recipe.id);

    observable.subscribe({
      next: () => {
        this.isFavorite = !this.isFavorite;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error toggling favorite:', error);
      }
    });
  }

  deleteRecipe() {
    if (!this.recipe || !this.isAuthor) {
      return;
    }

    if (confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      this.recipeService.deleteRecipe(this.recipe.id).subscribe({
        next: () => {
          this.router.navigate(['/recipes']);
        },
        error: error => {
          console.error('Error deleting recipe:', error);
        }
      });
    }
  }
}

