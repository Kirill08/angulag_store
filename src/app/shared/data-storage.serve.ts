import { AuthService } from './../auth/auth.service';
import { Recipe } from './../recipes/recipe.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipesService } from './../recipes/recipes-service/recipes.service';
import { pipe } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataStorageServece {

  private http: HttpClient;
  private recipesService: RecipesService;
  private authService: AuthService;

  constructor(http: HttpClient,
              recipesService: RecipesService,
              authService: AuthService) {
    this.http = http;
    this.recipesService = recipesService;
    this.authService = authService;
  }

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http.put('https://ng-course-recipe-book-62416.firebaseio.com/recipes.json', recipes)
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
        return this.http
        .get<Recipe[]>(
          'https://ng-course-recipe-book-62416.firebaseio.com/recipes.json'
        )
        .pipe(
          map((recipes) => {
            return recipes.map(recipe => {
              return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            });
          }),
          tap(recipes => {
            this.recipesService.setRecipes(recipes);
          })
        );
  }
}
