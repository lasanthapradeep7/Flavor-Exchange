import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

export const RECIPE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./recipe-list/recipe-list.component').then(m => m.RecipeListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./recipe-edit/recipe-edit.component').then(m => m.RecipeEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./recipe-edit/recipe-edit.component').then(m => m.RecipeEditComponent),
    canActivate: [AuthGuard]
  }
]; 