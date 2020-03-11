import { Action } from '@ngrx/store';

import { Ingredient } from './../../shared/ingredient.model';

export const ADD_INGREDIENT = '[Shopping list] Add ingredient';
export const ADD_INGREDIENTS = '[Shopping list] Add ingredients';
export const UPDATE_INGREDIENT = '[Shopping list] Update ingredients';
export const DELETE_INGREDIENT = '[Shopping list] Delete ingredients';
export const START_EDIT = '[Shopping list] start edit';
export const STOP_EDIT = '[Shopping list] stop edit';

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  public payload: Ingredient;

  constructor(payload: Ingredient) {
    this.payload = payload;
  }
}

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;
  public payload: Ingredient[];

  constructor(payload: Ingredient[]) {
    this.payload = payload;
  }
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  public payload: Ingredient;

  constructor(payload: Ingredient) {
    this.payload = payload;
  }
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;
}

export class StartEdit implements Action {
  readonly type = START_EDIT;
  payload: number;
  constructor(payload: number) {
    this.payload = payload;
  }
}

export class StoptEdit implements Action {
  readonly type = STOP_EDIT;
}

export type ShoppingListActions =
| AddIngredient
| AddIngredients
| UpdateIngredient
| DeleteIngredient
| StartEdit
| StoptEdit;
