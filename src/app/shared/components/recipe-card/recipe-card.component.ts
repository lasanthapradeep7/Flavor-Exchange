import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="recipe-card" [routerLink]="['/recipes', recipe.id]">
      <img [src]="recipe.imageUrl" [alt]="recipe.title" class="recipe-image">
      <div *ngIf="showFavoriteButton" class="favorite-button" (click)="onToggleFavorite($event)">
        <i class="fas" [class.fa-heart]="isFavorite" [class.fa-heart-o]="!isFavorite"></i>
      </div>
      <div class="recipe-content">
        <h3>{{recipe.title}}</h3>
        <p class="description">{{recipe.description}}</p>
        <div class="recipe-meta">
          <span class="cooking-time">
            <i class="fas fa-clock"></i>
            {{recipe.cookingTime}} mins
          </span>
          <span class="rating">
            <i class="fas fa-star"></i>
            {{recipe.rating}}
          </span>
        </div>
        <div class="tags">
          <span *ngFor="let tag of recipe.tags" class="tag">
            {{tag}}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recipe-card {
      position: relative;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .favorite-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: white;
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1;

      i {
        color: var(--error-color);
        font-size: 1.25rem;
      }
    }

    .recipe-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .recipe-content {
      padding: 1rem;

      h3 {
        margin: 0 0 0.5rem;
        color: var(--gray-900);
        font-size: 1.25rem;
      }

      .description {
        margin: 0 0 1rem;
        color: var(--gray-600);
        font-size: 0.875rem;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .recipe-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
      color: var(--gray-600);
      font-size: 0.875rem;

      i {
        margin-right: 0.25rem;
        color: var(--primary-color);
      }
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .tag {
        background-color: var(--gray-100);
        color: var(--gray-700);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
      }
    }
  `]
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;
  @Input() showFavoriteButton = false;
  @Input() isFavorite = false;
  @Output() toggleFavorite = new EventEmitter<string>();

  onToggleFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavorite.emit(this.recipe.id);
  }
}
