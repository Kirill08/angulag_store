import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ShoppingService } from './shopping-service/shopping.service';
import { Ingredient } from './../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  // providers: [ShoppingService]
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];
  shoppingService: ShoppingService;
  private igChangeSub: Subscription;

  constructor(shopService: ShoppingService, igChangeSub: Subscription) {
    debugger;
    this.shoppingService = shopService;
    this.igChangeSub = igChangeSub;
  }

  ngOnInit() {
    debugger;
    this.ingredients = this.shoppingService.getIngredients();
    this.igChangeSub = this.shoppingService.ingredientsChanged
      .subscribe((ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      });
  }

  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingService.startedientsChanged.next(index);
  }
}
