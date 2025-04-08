import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../models/recipe.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites = new BehaviorSubject<{ [userId: string]: string[] }>({});
  private apiUrl = `${environment.apiUrl}/favorites`;

  constructor(private authService: AuthService, private http: HttpClient) {
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites.next(JSON.parse(storedFavorites));
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('favorites', JSON.stringify(this.favorites.value));
  }

  getUserFavorites(userId: string): string[] {
    return this.favorites.value[userId] || [];
  }

  isFavorite(recipeId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${recipeId}`);
  }

  toggleFavorite(recipeId: string): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to manage favorites');
    }

    const userFavorites = this.getUserFavorites(currentUser.id);
    const isFavorite = userFavorites.includes(recipeId);
    
    const updatedFavorites = { ...this.favorites.value };
    if (isFavorite) {
      // Remove from favorites
      updatedFavorites[currentUser.id] = userFavorites.filter(id => id !== recipeId);
    } else {
      // Add to favorites
      updatedFavorites[currentUser.id] = [...userFavorites, recipeId];
    }

    this.favorites.next(updatedFavorites);
    this.saveToLocalStorage();

    return of(!isFavorite);
  }

  getFavoriteRecipes(recipes: Recipe[]): Observable<Recipe[]> {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user) return [];
        const userFavorites = this.getUserFavorites(user.id);
        return recipes.filter(recipe => userFavorites.includes(recipe.id));
      })
    );
  }

  getFavorites(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  addFavorite(recipeId: string): Observable<void> {
    return this.http.post<void>(this.apiUrl, { recipeId });
  }

  removeFavorite(recipeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}`);
  }
} 