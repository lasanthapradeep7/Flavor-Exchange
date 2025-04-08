import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  servings: number;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper',
      imageUrl: 'https://example.com/carbonara.jpg',
      cookingTime: 30,
      servings: 4,
      rating: 4.5
    },
    {
      id: '2',
      title: 'Chicken Tikka Masala',
      description: 'Grilled chicken chunks in spiced curry sauce',
      imageUrl: 'https://example.com/tikka-masala.jpg',
      cookingTime: 45,
      servings: 4,
      rating: 4.8
    }
  ];

  constructor() {}

  getRecipes(): Observable<Recipe[]> {
    return of(this.mockRecipes);
  }

  getRecipeById(id: string): Observable<Recipe | undefined> {
    const recipe = this.mockRecipes.find(r => r.id === id);
    return of(recipe);
  }

  createRecipe(recipe: Omit<Recipe, 'id'>): Observable<Recipe> {
    const newRecipe: Recipe = {
      ...recipe,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.mockRecipes.push(newRecipe);
    return of(newRecipe);
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe | undefined> {
    const index = this.mockRecipes.findIndex(r => r.id === id);
    if (index === -1) {
      return of(undefined);
    }
    
    this.mockRecipes[index] = {
      ...this.mockRecipes[index],
      ...recipe
    };
    return of(this.mockRecipes[index]);
  }

  deleteRecipe(id: string): Observable<boolean> {
    const index = this.mockRecipes.findIndex(r => r.id === id);
    if (index === -1) {
      return of(false);
    }
    
    this.mockRecipes.splice(index, 1);
    return of(true);
  }
} 