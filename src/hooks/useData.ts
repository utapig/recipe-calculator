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
    // 戦略: INITIALデータのIDは常にINITIALの内容で上書き。ユーザーが追加した項目（INITIALにないID）のみ保持。
    const storedIngredients = localStorage.getItem(STORAGE_KEY_INGREDIENTS);
    if (storedIngredients) {
      const parsed = JSON.parse(storedIngredients) as Ingredient[];
      const initialIds = new Set(INITIAL_INGREDIENTS.map(i => i.id));
      // ユーザー追加分（INITIALにないID）だけ残す
      const userAdded = parsed.filter(i => !initialIds.has(i.id));
      const merged = [...INITIAL_INGREDIENTS, ...userAdded];
      setIngredients(merged);
      localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(merged));
    } else {
      setIngredients(INITIAL_INGREDIENTS);
      localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(INITIAL_INGREDIENTS));
    }

    // --- レシピロード（同様の戦略） ---
    const storedRecipes = localStorage.getItem(STORAGE_KEY_RECIPES);
    if (storedRecipes) {
      const parsed = JSON.parse(storedRecipes) as Recipe[];
      const initialIds = new Set(INITIAL_RECIPES.map(r => r.id));
      // ユーザー追加分（INITIALにないID）だけ残す
      const userAdded = parsed.filter(r => !initialIds.has(r.id));
      const merged = [...INITIAL_RECIPES, ...userAdded];
      setRecipes(merged);
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(merged));
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