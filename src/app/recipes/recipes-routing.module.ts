import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';

const routes: Routes = [
  {
    path: '',
    component: RecipeListComponent
  },
  {
    path: 'new',
    component: RecipeEditComponent
  },
  {
    path: ':id',
    component: RecipeDetailComponent
  },
  {
    path: ':id/edit',
    component: RecipeEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }