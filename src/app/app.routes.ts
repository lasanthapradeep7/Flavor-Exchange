import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/recipes',
    pathMatch: 'full'
  },
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/recipes.routes').then(m => m.RECIPE_ROUTES)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.routes').then(m => m.FAVORITE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/recipes'
  }
];
