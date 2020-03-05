import { Action } from '@ngrx/store';

import { Ingredient } from './../../shared/ingredient.model';

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

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
