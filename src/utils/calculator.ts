import type { Recipe } from '../hooks/useData';
import type { Ingredient } from '../data/ingredients';

export interface CalculationEntry {
  recipeId: string;
  portions: number;
}

export type CalculatedItem = Ingredient & { calculatedAmountG: number };

export function calculateIngredients(
  entries: CalculationEntry[],
  recipes: Recipe[],
  ingredients: Ingredient[]
): CalculatedItem[] {
  if (entries.length === 0) return [];

  const sums = new Map<string, number>();

  entries.forEach(entry => {
    const recipe = recipes.find(r => r.id === entry.recipeId);
    if (!recipe) return;

    const ratio = entry.portions / recipe.basePortions;
    recipe.ingredients.forEach(ri => {
      const currentSum = sums.get(ri.ingredientId) || 0;
      sums.set(ri.ingredientId, currentSum + (ri.amountG * ratio));
    });
  });

  const result = Array.from(sums.entries()).map(([ingId, sumAmount]) => {
    const ingIdString = String(ingId);
    const ing = ingredients.find(i => String(i.id) === ingIdString);
    return {
      ...(ing || { id: ingIdString, name: `Unknown（ID: ${ingIdString}）`, type: 'normal' as const }),
      calculatedAmountG: Math.round(sumAmount * 10) / 10
    } as CalculatedItem;
  });

  result.sort((a, b) => {
    if (!a || !b) return 0;
    const nameA = a.name || '';
    const nameB = b.name || '';
    return nameA.localeCompare(nameB, 'ja');
  });

  return result;
}
