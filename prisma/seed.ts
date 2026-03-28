import { PrismaClient, type IngredientType } from '@prisma/client';
import { INITIAL_INGREDIENTS } from '../src/data/ingredients';
import { INITIAL_RECIPES } from '../src/data/recipes';

const prisma = new PrismaClient();

interface RecipeIngredientSeedRow {
  recipeId: string;
  ingredientId: string;
  amountG: number;
  sortOrder: number;
}

function buildRecipeIngredientRows(): RecipeIngredientSeedRow[] {
  return INITIAL_RECIPES.flatMap((recipe) =>
    recipe.ingredients.map((ingredient, index) => ({
      recipeId: recipe.id,
      ingredientId: ingredient.ingredientId,
      amountG: ingredient.amountG,
      sortOrder: index,
    }))
  );
}

async function main() {
  const recipeIngredientRows = buildRecipeIngredientRows();

  for (const ingredient of INITIAL_INGREDIENTS) {
    await prisma.ingredient.upsert({
      where: { id: ingredient.id },
      update: {
        name: ingredient.name,
        type: ingredient.type as IngredientType,
        packageInfo: ingredient.packageInfo ?? null,
        notes: ingredient.notes ?? null,
      },
      create: {
        id: ingredient.id,
        name: ingredient.name,
        type: ingredient.type as IngredientType,
        packageInfo: ingredient.packageInfo ?? null,
        notes: ingredient.notes ?? null,
      },
    });
  }

  for (const recipe of INITIAL_RECIPES) {
    await prisma.recipe.upsert({
      where: { id: recipe.id },
      update: {
        name: recipe.name,
        basePortions: recipe.basePortions,
      },
      create: {
        id: recipe.id,
        name: recipe.name,
        basePortions: recipe.basePortions,
      },
    });
  }

  const recipeIds = INITIAL_RECIPES.map((recipe) => recipe.id);
  await prisma.recipeIngredient.deleteMany({
    where: {
      recipeId: {
        in: recipeIds,
      },
    },
  });

  if (recipeIngredientRows.length > 0) {
    await prisma.recipeIngredient.createMany({
      data: recipeIngredientRows,
    });
  }

  console.log(
    `Seed completed: ${INITIAL_INGREDIENTS.length} ingredients, ${INITIAL_RECIPES.length} recipes, ${recipeIngredientRows.length} recipe-ingredient rows.`
  );
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
