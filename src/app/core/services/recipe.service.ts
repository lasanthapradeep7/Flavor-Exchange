import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { Recipe, RecipeFormData } from '../models/recipe.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper',
    imageUrl: 'https://example.com/carbonara.jpg',
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    rating: 4.5,
    ingredients: [
      { name: 'Spaghetti', amount: 400, unit: 'g' },
      { name: 'Eggs', amount: 4, unit: 'whole' },
      { name: 'Pecorino Romano', amount: 100, unit: 'g' },
      { name: 'Pancetta', amount: 150, unit: 'g' },
      { name: 'Black Pepper', amount: 2, unit: 'tsp' }
    ],
    instructions: [
      'Bring a large pot of salted water to boil',
      'Cook spaghetti according to package instructions',
      'Meanwhile, cook diced pancetta until crispy',
      'Whisk eggs, cheese, and pepper in a bowl',
      'Combine hot pasta with egg mixture and pancetta'
    ],
    tags: ['Italian', 'Pasta', 'Quick'],
    authorId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    description: 'Grilled chicken chunks in spiced curry sauce',
    imageUrl: 'https://example.com/tikka-masala.jpg',
    cookingTime: 45,
    servings: 6,
    difficulty: 'Medium',
    rating: 4.8,
    ingredients: [
      { name: 'Chicken Breast', amount: 800, unit: 'g' },
      { name: 'Yogurt', amount: 200, unit: 'ml' },
      { name: 'Tomato Sauce', amount: 400, unit: 'ml' },
      { name: 'Heavy Cream', amount: 200, unit: 'ml' },
      { name: 'Garam Masala', amount: 2, unit: 'tbsp' }
    ],
    instructions: [
      'Marinate chicken in yogurt and spices',
      'Grill chicken until charred',
      'Prepare curry sauce with tomatoes and cream',
      'Combine grilled chicken with sauce',
      'Simmer until thick'
    ],
    tags: ['Indian', 'Curry', 'Spicy'],
    authorId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = `${environment.apiUrl}/recipes`;
  private recipes = new BehaviorSubject<Recipe[]>(MOCK_RECIPES);
  recipes$ = this.recipes.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    // Load recipes from localStorage if available
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      this.recipes.next(JSON.parse(storedRecipes));
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('recipes', JSON.stringify(this.recipes.value));
  }

  getRecipes(): Observable<Recipe[]> {
    return this.recipes$;
  }

  getRecipeById(id: string): Observable<Recipe | undefined> {
    return this.recipes$.pipe(
      map(recipes => recipes.find(recipe => recipe.id === id))
    );
  }

  searchRecipes(query: string): Observable<Recipe[]> {
    return this.recipes$.pipe(
      map(recipes => recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(query.toLowerCase())) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }

  createRecipe(data: RecipeFormData & { authorId: string }): Observable<Recipe> {
    const newRecipe: Recipe = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      rating: 0,
      difficulty: data.difficulty === 'medium' ? 'Medium' : data.difficulty === 'easy' ? 'Easy' : 'Hard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const currentRecipes = this.recipes.value;
    this.recipes.next([...currentRecipes, newRecipe]);
    this.saveToLocalStorage();
    return of(newRecipe);
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe> {
    const currentRecipes = this.recipes.value;
    const index = currentRecipes.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Recipe not found');
    }

    const updatedRecipe: Recipe = {
      ...currentRecipes[index],
      ...recipe,
      updatedAt: new Date().toISOString()
    };

    currentRecipes[index] = updatedRecipe;
    this.recipes.next([...currentRecipes]);
    this.saveToLocalStorage();
    return of(updatedRecipe);
  }

  deleteRecipe(id: string): Observable<void> {
    const currentRecipes = this.recipes.value;
    const filteredRecipes = currentRecipes.filter(recipe => recipe.id !== id);
    this.recipes.next(filteredRecipes);
    this.saveToLocalStorage();
    return of(void 0);
  }
}
