import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ShoppingService } from './shopping-service/shopping.service';
import { Ingredient } from './../shared/ingredient.model';

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

  constructor(shopService: ShoppingService) {
    this.shoppingService = shopService;
  }

  ngOnInit() {
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
