import { RecipesService } from './recipes.service';
import { DataStorageServece } from './../../shared/data-storage.serve';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Recipe } from './../recipe.model';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipesresolverService implements Resolve<Recipe[]> {

  dataStorageService: DataStorageServece;
  recipesService: RecipesService;
  constructor(dataStorageService: DataStorageServece, recipesService: RecipesService) {
    this.dataStorageService = dataStorageService;
    this.recipesService = recipesService;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipesService.getRecipes();

    if (recipes.length === 0) {
      return this.dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
