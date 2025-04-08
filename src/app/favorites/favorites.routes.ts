import { Routes } from '@angular/router';

export const FAVORITE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./favorites-list/favorites-list.component').then(m => m.FavoritesListComponent)
  }
]; 