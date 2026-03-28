import { prisma } from '../_lib/prisma.js';

function methodNotAllowed(res: any) {
  return res.status(405).json({ error: 'Method not allowed' });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'DELETE') {
    return methodNotAllowed(res);
  }

  const { id } = req.query;
  const ingredientId = Array.isArray(id) ? id[0] : id;

  if (!ingredientId || typeof ingredientId !== 'string') {
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    await prisma.ingredient.delete({ where: { id: ingredientId } });
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    if (error?.code === 'P2003') {
      return res.status(409).json({ error: 'この材料はレシピで使用中のため削除できません。' });
    }
    return res.status(500).json({ error: '材料削除に失敗しました。' });
  }
}
