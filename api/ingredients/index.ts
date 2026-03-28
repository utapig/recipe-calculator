import { prisma } from '../_lib/prisma.js';

function methodNotAllowed(res: any) {
  return res.status(405).json({ error: 'Method not allowed' });
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });

    return res.status(200).json(
      ingredients.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        packageInfo: item.packageInfo ?? undefined,
        notes: item.notes ?? undefined,
      }))
    );
  }

  if (req.method === 'POST') {
    const { id, name, type, packageInfo, notes } = req.body ?? {};
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'id is required' });
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'name is required' });
    if (type !== 'normal' && type !== 'special') return res.status(400).json({ error: 'type must be normal or special' });

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

    return res.status(200).json({
      id: ingredient.id,
      name: ingredient.name,
      type: ingredient.type,
      packageInfo: ingredient.packageInfo ?? undefined,
      notes: ingredient.notes ?? undefined,
    });
  }

  return methodNotAllowed(res);
}
