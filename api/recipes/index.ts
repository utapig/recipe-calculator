import { prisma } from '../_lib/prisma.js';

function methodNotAllowed(res: any) {
  return res.status(405).json({ error: 'Method not allowed' });
}

function toRecipeResponse(recipe: any) {
  return {
    id: recipe.id,
    name: recipe.name,
    basePortions: recipe.basePortions,
    ingredients: recipe.recipeIngredients
      .slice()
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
      .map((ri: any) => ({ ingredientId: ri.ingredientId, amountG: Number(ri.amountG) })),
  };
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const recipes = await prisma.recipe.findMany({
      include: { recipeIngredients: true },
      orderBy: { id: 'asc' },
    });

    return res.status(200).json(recipes.map(toRecipeResponse));
  }

  if (req.method === 'POST') {
    const { id, name, basePortions, ingredients } = req.body ?? {};
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'id is required' });
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'name is required' });
    if (!Number.isInteger(basePortions) || basePortions <= 0) return res.status(400).json({ error: 'basePortions must be a positive integer' });
    if (!Array.isArray(ingredients)) return res.status(400).json({ error: 'ingredients must be array' });

    const rows = ingredients.map((item: any, index: number) => ({
      recipeId: id,
      ingredientId: String(item.ingredientId),
      amountG: Number(item.amountG),
      sortOrder: index,
    }));

    if (rows.some((item: any) => !item.ingredientId || !Number.isFinite(item.amountG) || item.amountG <= 0)) {
      return res.status(400).json({ error: 'invalid ingredient rows' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.recipe.upsert({
        where: { id },
        create: { id, name, basePortions },
        update: { name, basePortions },
      });

      await tx.recipeIngredient.deleteMany({ where: { recipeId: id } });
      if (rows.length > 0) {
        await tx.recipeIngredient.createMany({ data: rows });
      }
    });

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { recipeIngredients: true },
    });

    return res.status(200).json(recipe ? toRecipeResponse(recipe) : { id, name, basePortions, ingredients: [] });
  }

  return methodNotAllowed(res);
}
