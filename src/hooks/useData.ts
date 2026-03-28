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
import {
  normalizeRecipes,
  type RecipeIngredientRow,
  type RecipeRow,
} from '../data/recipeDb';

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // ignore JSON parsing errors and keep default message
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function recipeEquals(a: Recipe, b: Recipe): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function ingredientEquals(a: Ingredient, b: Ingredient): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useData() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [apiAvailable, setApiAvailable] = useState(false);

  // ロード処理
  useEffect(() => {
    const loadFromApi = async () => {
      try {
        const [loadedIngredients, loadedRecipes] = await Promise.all([
          apiRequest<Ingredient[]>('/api/ingredients'),
          apiRequest<Recipe[]>('/api/recipes'),
        ]);
        setIngredients(loadedIngredients);
        setRecipes(loadedRecipes);
        setApiAvailable(true);
      } catch (error) {
        // API未起動時でも画面確認はできるようにフォールバック
        console.warn('API unavailable. Falling back to initial local data.', error);
        setIngredients(INITIAL_INGREDIENTS);
        setRecipes(INITIAL_RECIPES);
        setApiAvailable(false);
      }
    };

    void loadFromApi();
  }, []);

  const saveIngredients = async (newIngredients: Ingredient[]) => {
    const previousIngredients = ingredients;
    setIngredients(newIngredients);

    if (!apiAvailable) return;

    try {
      const previousById = new Map(previousIngredients.map((item) => [item.id, item]));
      const nextById = new Map(newIngredients.map((item) => [item.id, item]));

      const upserts = newIngredients.filter((nextItem) => {
        const previousItem = previousById.get(nextItem.id);
        return !previousItem || !ingredientEquals(previousItem, nextItem);
      });

      const deletes = previousIngredients.filter((previousItem) => !nextById.has(previousItem.id));

      for (const item of upserts) {
        await apiRequest<Ingredient>('/api/ingredients', {
          method: 'POST',
          body: JSON.stringify(item),
        });
      }

      for (const item of deletes) {
        await apiRequest<{ ok: boolean }>(`/api/ingredients/${encodeURIComponent(item.id)}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      setIngredients(previousIngredients);
      throw error;
    }
  };

  const saveRecipes = async (newRecipes: Recipe[]) => {
    const previousRecipes = recipes;
    setRecipes(newRecipes);

    if (!apiAvailable) return;

    try {
      const previousById = new Map(previousRecipes.map((item) => [item.id, item]));
      const nextById = new Map(newRecipes.map((item) => [item.id, item]));

      const upserts = newRecipes.filter((nextItem) => {
        const previousItem = previousById.get(nextItem.id);
        return !previousItem || !recipeEquals(previousItem, nextItem);
      });

      const deletes = previousRecipes.filter((previousItem) => !nextById.has(previousItem.id));

      for (const item of upserts) {
        await apiRequest<Recipe>('/api/recipes', {
          method: 'POST',
          body: JSON.stringify(item),
        });
      }

      for (const item of deletes) {
        await apiRequest<{ ok: boolean }>(`/api/recipes/${encodeURIComponent(item.id)}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      setRecipes(previousRecipes);
      throw error;
    }
  };

  const normalizedRecipeDb = normalizeRecipes(recipes);

  return {
    ingredients,
    recipes,
    recipeMaster: normalizedRecipeDb.recipes as RecipeRow[],
    recipeIngredients: normalizedRecipeDb.recipeIngredients as RecipeIngredientRow[],
    saveIngredients,
    saveRecipes,
    apiAvailable,
  };
}