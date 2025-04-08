import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../core/models/recipe.model';
import { FavoritesService } from '../../core/services/favorites.service';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RecipeCardComponent],
  template: `
    <div class="favorites-container">
      <h1>My Favorite Recipes</h1>

      <div *ngIf="isLoading" class="loading-container">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading your favorite recipes...</p>
      </div>

      <div *ngIf="!isLoading && (!favoriteRecipes || favoriteRecipes.length === 0)" class="empty-container">
        <i class="fas fa-heart-broken"></i>
        <p>You haven't saved any recipes to your favorites yet.</p>
        <a routerLink="/recipes" class="btn btn-primary">Browse Recipes</a>
      </div>

      <div *ngIf="!isLoading && favoriteRecipes && favoriteRecipes.length > 0" class="recipes-grid">
        <app-recipe-card
          *ngFor="let recipe of favoriteRecipes"
          [recipe]="recipe"
          [showFavoriteButton]="true"
          [isFavorite]="true"
          (toggleFavorite)="onToggleFavorite($event)"
        ></app-recipe-card>
      </div>
    </div>
  `,
  styles: [`
    .favorites-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;

      h1 {
        margin-bottom: 2rem;
        color: var(--gray-900);
        font-size: 2rem;
      }
    }

    .loading-container,
    .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      text-align: center;
      color: var(--gray-600);

      i {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
      }
    }

    .recipes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.2s;

      &.btn-primary {
        background-color: var(--primary-color);
        color: white;

        &:hover {
          background-color: var(--primary-dark);
        }
      }
    }

    @media (max-width: 768px) {
      .favorites-container {
        padding: 1rem;
      }

      .recipes-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class FavoritesListComponent implements OnInit {
  favoriteRecipes: Recipe[] | null = null;
  isLoading = true;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (recipes) => {
        this.favoriteRecipes = recipes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.isLoading = false;
      }
    });
  }

  onToggleFavorite(recipeId: string) {
    this.favoritesService.removeFavorite(recipeId).subscribe({
      next: () => {
        this.favoriteRecipes = this.favoriteRecipes?.filter(recipe => recipe.id !== recipeId) || null;
      },
      error: (error) => {
        console.error('Error removing favorite:', error);
      }
    });
  }
}
