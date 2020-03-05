import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { ShoppingService } from './../shopping-service/shopping.service';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  editMode = false;

  shoppingService: ShoppingService;
  productForm: FormGroup;
  subscription: Subscription;
  editedItem: Ingredient;
  private store: Store<fromShoppingList.AppState>;

  constructor(shoppService: ShoppingService,
              store: Store<fromShoppingList.AppState>) {
    this.shoppingService = shoppService;
    this.store = store;
  }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.productForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
    this.productForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      amount: new FormControl(0, [Validators.required, this.forbedAmount])
    });
  }

  onSubmit() {
    const value = this.productForm.value;

    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.shoppingService.updateIngredients(this.editedItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions
        .UpdateIngredient(newIngredient));
    } else {
      // this.shoppingService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.productForm.reset();
    this.store.dispatch(new ShoppingListActions.StoptEdit());
  }

  onCrear() {
    this.onClear();
  }

  onRomeve() {
    // this.shoppingService.romeveIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  forbedAmount(control: FormControl):
   {[s: string]: boolean} {
     if (control.value <= 0 || control.value > 20) {
       return {amountFroBidden: true};
     } else {
       return null;
     }
   }

   ngOnDestroy(): void {
   this.subscription.unsubscribe();
   this.store.dispatch(new ShoppingListActions.StoptEdit());
  }
}
