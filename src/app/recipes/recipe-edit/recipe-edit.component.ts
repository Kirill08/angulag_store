
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { RecipesService } from './../recipes-service/recipes.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number;
  editModele = false;
  recipeForm: FormGroup;
  recipeService: RecipesService;
  router: Router;
  route: ActivatedRoute;

  constructor(route: ActivatedRoute, recipeService: RecipesService, router: Router) {
    this.recipeService = recipeService;
    this.router = router;
    this.route = route;
   }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
      this.id = +params.id;
      this.editModele = params.id != null;
      this.initForm();
    });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagepath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editModele) {
    const recipe = this.recipeService.getRecipe(this.id);

    recipeName = recipe.name;
    recipeImagepath = recipe.imagePath;
    recipeDescription = recipe.description;
    if (recipe.ingredients) {
      for (const ingredient of recipe.ingredients) {
        recipeIngredients.push(
          new FormGroup({
            name: new FormControl(ingredient.name, Validators.required),
            amount: new FormControl(ingredient.amount, [
              Validators.required,
              Validators.pattern(/^[1-9]+[0-9]*$/)
            ])
          })
        );
      }
    }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagepath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  onRecipeSubmit() {
    const formValue = this.recipeForm.value;
    // const recipe = new Recipe(formValue.name, formValue.description, formValue.ingredients, formValue.ingredients);

    if (this.editModele) {
      this.recipeService.updateRecipe(this.id, formValue);
    } else {
    this.recipeService.addRecipe(formValue);
    }

    this.clear();
  }
  clear() {
    this.recipeForm.reset();
    this.editModele = false;
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  getFormAraay() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  onAddIngredient() {
    const formArray = this.getFormAraay();
    const control = new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    });

    formArray.push(control);
  }

  onCancel() {
    this.clear();
  }

  deleteRecipe(index: number) {
    let araay = this.getFormAraay();
    araay.removeAt(index);
  }
}
