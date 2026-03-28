import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.API_PORT || 3001);
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map((value) => value.trim()).filter(Boolean);

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

function toRecipeResponse(recipe) {
  return {
    id: recipe.id,
    name: recipe.name,
    basePortions: recipe.basePortions,
    ingredients: recipe.recipeIngredients
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((ri) => ({ ingredientId: ri.ingredientId, amountG: Number(ri.amountG) })),
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/ingredients', async (_req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
    res.json(
      ingredients.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        packageInfo: item.packageInfo ?? undefined,
        notes: item.notes ?? undefined,
      }))
    );
  } catch (error) {
    console.error('GET /api/ingredients failed:', error);
    res.status(500).json({ error: '材料取得に失敗しました。' });
  }
});

app.post('/api/ingredients', async (req, res) => {
  const { id, name, type, packageInfo, notes } = req.body ?? {};
  if (!id || typeof id !== 'string') return badRequest(res, 'id is required');
  if (!name || typeof name !== 'string') return badRequest(res, 'name is required');
  if (type !== 'normal' && type !== 'special') return badRequest(res, 'type must be normal or special');

  try {
    const ingredient = await prisma.ingredient.upsert({
      where: { id },
      create: {
        id,
        name,
        type,
        packageInfo: packageInfo ?? null,
        notes: notes ?? null,
      },
      update: {
        name,
        type,
        packageInfo: packageInfo ?? null,
        notes: notes ?? null,
      },
    });

    res.json({
      id: ingredient.id,
      name: ingredient.name,
      type: ingredient.type,
      packageInfo: ingredient.packageInfo ?? undefined,
      notes: ingredient.notes ?? undefined,
    });
  } catch (error) {
    console.error('POST /api/ingredients failed:', error);
    res.status(500).json({ error: '材料保存に失敗しました。' });
  }
});

app.delete('/api/ingredients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.ingredient.delete({ where: { id } });
    res.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/ingredients/:id failed:', error);
    // Prisma FK violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
      return res.status(409).json({ error: 'この材料はレシピで使用中のため削除できません。' });
    }
    res.status(500).json({ error: '材料削除に失敗しました。' });
  }
});

app.get('/api/recipes', async (_req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        recipeIngredients: true,
      },
      orderBy: { id: 'asc' },
    });

    res.json(recipes.map(toRecipeResponse));
  } catch (error) {
    console.error('GET /api/recipes failed:', error);
    res.status(500).json({ error: 'レシピ取得に失敗しました。' });
  }
});

app.post('/api/recipes', async (req, res) => {
  const { id, name, basePortions, ingredients } = req.body ?? {};
  if (!id || typeof id !== 'string') return badRequest(res, 'id is required');
  if (!name || typeof name !== 'string') return badRequest(res, 'name is required');
  if (!Number.isInteger(basePortions) || basePortions <= 0) return badRequest(res, 'basePortions must be a positive integer');
  if (!Array.isArray(ingredients)) return badRequest(res, 'ingredients must be array');

  const recipeIngredients = ingredients.map((item, index) => ({
    recipeId: id,
    ingredientId: String(item.ingredientId),
    amountG: Number(item.amountG),
    sortOrder: index,
  }));

  if (recipeIngredients.some((item) => !item.ingredientId || !Number.isFinite(item.amountG) || item.amountG <= 0)) {
    return badRequest(res, 'invalid ingredient rows');
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.recipe.upsert({
        where: { id },
        create: { id, name, basePortions },
        update: { name, basePortions },
      });

      await tx.recipeIngredient.deleteMany({ where: { recipeId: id } });
      if (recipeIngredients.length > 0) {
        await tx.recipeIngredient.createMany({ data: recipeIngredients });
      }
    });

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { recipeIngredients: true },
    });

    res.json(recipe ? toRecipeResponse(recipe) : { id, name, basePortions, ingredients: [] });
  } catch (error) {
    console.error('POST /api/recipes failed:', error);
    res.status(500).json({ error: 'レシピ保存に失敗しました。' });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.recipe.delete({ where: { id } });
    res.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/recipes/:id failed:', error);
    res.status(500).json({ error: 'レシピ削除に失敗しました。' });
  }
});

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
