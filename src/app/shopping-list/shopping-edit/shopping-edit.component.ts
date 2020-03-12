import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ShoppingService } from './../shopping-service/shopping.service';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  editMode = false;
  productForm: FormGroup;
  subscription: Subscription;
  editedItem: Ingredient;
  editedItemIndex: number;

  constructor(private shoppService: ShoppingService) {
  }

  ngOnInit() {
    this.subscription = this.shoppService.startedientsChanged
    .subscribe(
    (index: number) => {
      this.editedItemIndex = index;
      this.editMode = true;
      this.editedItem = this.shoppService.getIngridient(index);
      this.productForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      });
    }
    );
    this.productForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      amount: new FormControl(0, [Validators.required, this.forbedAmount])
    });
  }

  onSubmit() {
    const value = this.productForm.value;

    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.shoppService.updateIngredients(this.editedItemIndex, newIngredient);
    } else {
      this.shoppService.addIngredient(newIngredient);
    }
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.productForm.reset();
  }

  onCrear() {
    this.onClear();
  }

  onRomeve() {
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
  }
}
