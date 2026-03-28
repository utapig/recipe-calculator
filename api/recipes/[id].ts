import { prisma } from '../_lib/prisma.js';

function methodNotAllowed(res: any) {
  return res.status(405).json({ error: 'Method not allowed' });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'DELETE') {
    return methodNotAllowed(res);
  }

  const { id } = req.query;
  const recipeId = Array.isArray(id) ? id[0] : id;

  if (!recipeId || typeof recipeId !== 'string') {
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    await prisma.recipe.delete({ where: { id: recipeId } });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'レシピ削除に失敗しました。' });
  }
}
