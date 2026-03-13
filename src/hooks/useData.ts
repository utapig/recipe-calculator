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
import type { Ingredient } from '../data/ingredients';

const STORAGE_KEY_INGREDIENTS = 'recipe_calc_ingredients';
const STORAGE_KEY_RECIPES = 'recipe_calc_recipes';

export function useData() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // ロード処理
  useEffect(() => {
    const storedIngredients = localStorage.getItem(STORAGE_KEY_INGREDIENTS);
    if (storedIngredients) {
      setIngredients(JSON.parse(storedIngredients));
    } else {
      // 初回起動時はINITIAL_INGREDIENTSをセット
      setIngredients(INITIAL_INGREDIENTS);
      localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(INITIAL_INGREDIENTS));
    }

    const storedRecipes = localStorage.getItem(STORAGE_KEY_RECIPES);
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    } else {
      // ダミーレシピのセット
      const dummyRecipes: Recipe[] = [
        {
          id: 'dummy1',
          name: '【サンプル】ショートケーキ',
          basePortions: 1,
          ingredients: [
            { ingredientId: '1', amountG: 30 }, // グラニュー糖
            { ingredientId: '4', amountG: 25 }, // バイオレット
            { ingredientId: '7', amountG: 50 }, // 全卵
            { ingredientId: '101', amountG: 100 } // フレーズ
          ]
        },
        {
          id: 'dummy2',
          name: '【サンプル】チョコムース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '18', amountG: 50 }, // キャラットダーク
            { ingredientId: '5', amountG: 10 },  // ココア
            { ingredientId: '10', amountG: 2 }   // 板ゼラチン
          ]
        }
      ];
      setRecipes(dummyRecipes);
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(dummyRecipes));
    }
  }, []);

  // 保存処理（Ingredients）
  const saveIngredients = (newIngredients: Ingredient[]) => {
    setIngredients(newIngredients);
    localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(newIngredients));
  };

  // 保存処理（Recipes）
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
