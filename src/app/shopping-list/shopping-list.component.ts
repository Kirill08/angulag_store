import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Store} from '@ngrx/store';

import { ShoppingService } from './shopping-service/shopping.service';
import { Ingredient } from './../shared/ingredient.model';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  // providers: [ShoppingService]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;

  shoppingService: ShoppingService;
  private igChangeSub: Subscription;
  private store: Store<{shoppingList: {ingredients: Ingredient[]}}>;

  constructor(shopService: ShoppingService,
              store: Store<fromShoppingList.AppState>) {
    this.shoppingService = shopService;
    this.store = store;
    // this.igChangeSub = igChangeSub;
   }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');

    // this.ingredients = this.shoppingService.getIngredients();
    // this.igChangeSub = this.shoppingService.ingredientsChanged
    //   .subscribe((ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   });
  }

  ngOnDestroy(): void {
    //this.igChangeSub.unsubscribe();
  }

  onEditItem(index: number) {
    // this.shoppingService.startedientsChanged.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
