import { NgModule } from '@angular/core';
import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';

@NgModule({
  imports: [
    RecipesRoutingModule,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeEditComponent
  ]
})
export class RecipesModule { }