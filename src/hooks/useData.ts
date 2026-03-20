export interface RecipeIngredient {
  ingredientId: string;
  amountG: number;
}

export interface Recipe {
  id: string;
  name: string;
  basePortions: number;
  ingredients: RecipeIngredient[];
}

import { useState, useEffect } from 'react';
import { INITIAL_INGREDIENTS } from '../data/ingredients';
import { INITIAL_RECIPES } from '../data/recipes';
import type { Ingredient } from '../data/ingredients';

const STORAGE_KEY_INGREDIENTS = 'recipe_calc_ingredients';
const STORAGE_KEY_RECIPES = 'recipe_calc_recipes';

export function useData() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // ロード処理
  useEffect(() => {
    // --- 材料ロード ---
    const storedIngredients = localStorage.getItem(STORAGE_KEY_INGREDIENTS);
    if (storedIngredients) {
      const parsed = JSON.parse(storedIngredients) as Ingredient[];
      const newIngredients = INITIAL_INGREDIENTS.filter(
        initialIng => !parsed.some(storedIng => storedIng.id === initialIng.id)
      );
      if (newIngredients.length > 0) {
        const merged = [...parsed, ...newIngredients];
        setIngredients(merged);
        localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(merged));
      } else {
        setIngredients(parsed);
      }
    } else {
      setIngredients(INITIAL_INGREDIENTS);
      localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(INITIAL_INGREDIENTS));
    }

    // --- レシピロード（材料と同じマージ方式） ---
    const storedRecipes = localStorage.getItem(STORAGE_KEY_RECIPES);
    if (storedRecipes) {
      const parsed = JSON.parse(storedRecipes) as Recipe[];
      const newRecipes = INITIAL_RECIPES.filter(
        initialRec => !parsed.some(storedRec => storedRec.id === initialRec.id)
      );
      if (newRecipes.length > 0) {
        const merged = [...parsed, ...newRecipes];
        setRecipes(merged);
        localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(merged));
      } else {
        setRecipes(parsed);
      }
    } else {
      setRecipes(INITIAL_RECIPES);
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(INITIAL_RECIPES));
    }
  }, []);

  const saveIngredients = (newIngredients: Ingredient[]) => {
    setIngredients(newIngredients);
    localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(newIngredients));
  };

  const saveRecipes = (newRecipes: Recipe[]) => {
    setRecipes(newRecipes);
    localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(newRecipes));
  };

  return {
    ingredients,
    recipes,
    saveIngredients,
    saveRecipes
  };
}