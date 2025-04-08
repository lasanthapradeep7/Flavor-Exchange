import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { AuthService } from '../../core/services/auth.service';
import { Recipe } from '../../core/models/recipe.model';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="recipe-edit-container">
      <h1>{{ isEditMode ? 'Edit Recipe' : 'Create New Recipe' }}</h1>
      
      <form [formGroup]="recipeForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" formControlName="title" class="form-control">
          <div class="error-message" *ngIf="recipeForm.get('title')?.errors?.['required'] && recipeForm.get('title')?.touched">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description" class="form-control" rows="3"></textarea>
          <div class="error-message" *ngIf="recipeForm.get('description')?.errors?.['required'] && recipeForm.get('description')?.touched">
            Description is required
          </div>
        </div>

        <div class="form-group">
          <label for="imageUrl">Image URL</label>
          <input type="url" id="imageUrl" formControlName="imageUrl" class="form-control">
          <div class="error-message" *ngIf="recipeForm.get('imageUrl')?.errors?.['required'] && recipeForm.get('imageUrl')?.touched">
            Image URL is required
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="cookingTime">Cooking Time (minutes)</label>
            <input type="number" id="cookingTime" formControlName="cookingTime" class="form-control">
          </div>

          <div class="form-group">
            <label for="servings">Servings</label>
            <input type="number" id="servings" formControlName="servings" class="form-control">
          </div>
        </div>

        <div class="form-group">
          <label>Ingredients</label>
          <div formArrayName="ingredients">
            <div *ngFor="let ingredient of ingredients.controls; let i=index" [formGroupName]="i" class="ingredient-row">
              <input type="text" formControlName="name" placeholder="Name" class="form-control">
              <input type="number" formControlName="amount" placeholder="Amount" class="form-control">
              <input type="text" formControlName="unit" placeholder="Unit" class="form-control">
              <button type="button" class="btn btn-danger" (click)="removeIngredient(i)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <button type="button" class="btn btn-secondary" (click)="addIngredient()">
            <i class="fas fa-plus"></i> Add Ingredient
          </button>
        </div>

        <div class="form-group">
          <label>Instructions</label>
          <div formArrayName="instructions">
            <div *ngFor="let instruction of instructions.controls; let i=index" class="instruction-row">
              <textarea [formControlName]="i" class="form-control" rows="2"></textarea>
              <button type="button" class="btn btn-danger" (click)="removeInstruction(i)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <button type="button" class="btn btn-secondary" (click)="addInstruction()">
            <i class="fas fa-plus"></i> Add Instruction
          </button>
        </div>

        <div class="form-group">
          <label>Tags</label>
          <div formArrayName="tags">
            <div *ngFor="let tag of tags.controls; let i=index" class="tag-row">
              <input type="text" [formControlName]="i" class="form-control">
              <button type="button" class="btn btn-danger" (click)="removeTag(i)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <button type="button" class="btn btn-secondary" (click)="addTag()">
            <i class="fas fa-plus"></i> Add Tag
          </button>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="recipeForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Recipe' : 'Create Recipe') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .recipe-edit-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      margin-bottom: 2rem;
      color: var(--gray-900);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--gray-700);
      font-weight: 500;
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

    .ingredient-row,
    .instruction-row,
    .tag-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      align-items: flex-start;

      .form-control {
        flex: 1;
      }

      .btn-danger {
        padding: 0.5rem;
        font-size: 1rem;
      }
    }

    .ingredient-row {
      input:first-child {
        flex: 2;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
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
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RecipeEditComponent implements OnInit {
  recipeForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  recipe: Recipe | null = null;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const recipeId = this.route.snapshot.params['id'];
    if (recipeId) {
      this.isEditMode = true;
      this.recipeService.getRecipeById(recipeId).subscribe(recipe => {
        if (!recipe) {
          this.router.navigate(['/recipes']);
          return;
        }
        if (recipe.authorId !== this.authService.getCurrentUser()?.id) {
          this.router.navigate(['/recipes', recipe.id]);
          return;
        }
        this.recipe = recipe;
        this.populateForm(recipe);
      });
    }
  }

  private initForm() {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      cookingTime: [30, [Validators.required, Validators.min(1)]],
      servings: [4, [Validators.required, Validators.min(1)]],
      difficulty: ['medium', Validators.required],
      ingredients: this.fb.array([]),
      instructions: this.fb.array([]),
      tags: this.fb.array([])
    });
  }

  private populateForm(recipe: Recipe) {
    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty
    });

    // Clear and repopulate arrays
    this.ingredients.clear();
    recipe.ingredients.forEach(ingredient => {
      this.ingredients.push(this.fb.group({
        name: [ingredient.name, Validators.required],
        amount: [ingredient.amount, [Validators.required, Validators.min(0)]],
        unit: [ingredient.unit, Validators.required]
      }));
    });

    this.instructions.clear();
    recipe.instructions.forEach(instruction => {
      this.instructions.push(this.fb.control(instruction, Validators.required));
    });

    this.tags.clear();
    recipe.tags.forEach(tag => {
      this.tags.push(this.fb.control(tag, Validators.required));
    });
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  get tags() {
    return this.recipeForm.get('tags') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.fb.group({
      name: ['', Validators.required],
      amount: [1, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required]
    }));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addInstruction() {
    this.instructions.push(this.fb.control('', Validators.required));
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  addTag() {
    this.tags.push(this.fb.control('', Validators.required));
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  cancel() {
    this.router.navigate(['/recipes']);
  }

  onSubmit() {
    if (this.recipeForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const recipeData = {
      ...this.recipeForm.value,
      authorId: currentUser.id
    };

    if (this.isEditMode && this.recipe) {
      this.recipeService.updateRecipe(this.recipe.id, recipeData).subscribe({
        next: (updatedRecipe) => {
          if (updatedRecipe) {
            this.router.navigate(['/recipes', updatedRecipe.id]);
          }
        },
        error: (error) => {
          console.error('Error updating recipe:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.recipeService.createRecipe(recipeData).subscribe({
        next: (newRecipe) => {
          this.router.navigate(['/recipes', newRecipe.id]);
        },
        error: (error) => {
          console.error('Error creating recipe:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}
