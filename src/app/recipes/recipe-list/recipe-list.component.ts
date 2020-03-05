import { Subscription } from 'rxjs';
import { RecipesService } from './../recipes-service/recipes.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Recipe} from '../recipe.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  // providers: [UsersService]

})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipesService: RecipesService;
  recipes: Recipe[] = [];
  router: Router;
  route: ActivatedRoute;
  subscription: Subscription;

  constructor(resService: RecipesService, router: Router, route: ActivatedRoute) {
    this.recipesService = resService;
    this.router = router;
    this.route = route;
  }

  ngOnInit() {
    this.subscription = this.recipesService
    .recipeChanged
    .subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });

    this.recipes = this.recipesService.getRecipes();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
