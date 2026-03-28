import type { Recipe } from '../hooks/useData';

export interface RecipeRow {
    id: string;
    name: string;
    basePortions: number;
}

export interface RecipeIngredientRow {
    id: string;
    recipeId: string;
    ingredientId: string;
    amountG: number;
    sortOrder: number;
}

export interface RecipeDb {
    recipes: RecipeRow[];
    recipeIngredients: RecipeIngredientRow[];
}

export function normalizeRecipes(recipes: Recipe[]): RecipeDb {
    const recipeRows: RecipeRow[] = recipes.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        basePortions: recipe.basePortions,
    }));

    const recipeIngredientRows: RecipeIngredientRow[] = recipes.flatMap((recipe) =>
        recipe.ingredients.map((ingredient, index) => ({
            id: `${recipe.id}_${index + 1}`,
            recipeId: recipe.id,
            ingredientId: ingredient.ingredientId,
            amountG: ingredient.amountG,
            sortOrder: index,
        }))
    );

    return {
        recipes: recipeRows,
        recipeIngredients: recipeIngredientRows,
    };
}

export function denormalizeRecipes(db: RecipeDb): Recipe[] {
    const recipeIngredientsByRecipeId = new Map<string, RecipeIngredientRow[]>();

    db.recipeIngredients.forEach((row) => {
        const currentRows = recipeIngredientsByRecipeId.get(row.recipeId) ?? [];
        currentRows.push(row);
        recipeIngredientsByRecipeId.set(row.recipeId, currentRows);
    });

    return db.recipes.map((recipeRow) => {
        const ingredientRows = (recipeIngredientsByRecipeId.get(recipeRow.id) ?? [])
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder);

        return {
            id: recipeRow.id,
            name: recipeRow.name,
            basePortions: recipeRow.basePortions,
            ingredients: ingredientRows.map((row) => ({
                ingredientId: row.ingredientId,
                amountG: row.amountG,
            })),
        };
    });
}
