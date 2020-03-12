import { Subject } from 'rxjs';
import { Injectable} from '@angular/core';

import { Recipe } from './../recipe.model';
import { ShoppingService } from './../../shopping-list/shopping-service/shopping.service';
import { Ingredient } from 'src/app/shared/ingredient.model';
@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  recipeChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('A test Recipe',
  //    'Asuper-tasty Schnitzel - just awesone!',
  //     'https://assets.bonappetit.com/photos/5d7296eec4af4d0008ad1263/3:2/w_2560,c_limit/Basically-Gojuchang-Chicken-Recipe-Wide.jpg',
  //      [
  //        new Ingredient('Meat', 1),
  //       new Ingredient('French Fries', 20)
  //      ]),
  //   new Recipe('Another test Recipe',
  //    'What else you need to say?',
  //     'https://assets.bonappetit.com/photos/5d7296eec4af4d0008ad1263/3:2/w_2560,c_limit/Basically-Gojuchang-Chicken-Recipe-Wide.jpg',
  //     [
  //       new Ingredient('Buns', 2),
  //       new Ingredient('Meat', 1)
  //     ])
  // ];

  private recipes: Recipe[] = [];
  private shoppingListService: ShoppingService;

  constructor(shoppListService: ShoppingService) {
    this.shoppingListService = shoppListService;
  }

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  // getRecipeById(id: number) {
  //   const recipe = this.recipes.find((s) => {
  //     return s.id === id;
  //   });

  //   return recipe;
  // }

  getRecipe(index: number) {
    return this.recipes[index];
    // return this.recipes.slice()[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
    // this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
