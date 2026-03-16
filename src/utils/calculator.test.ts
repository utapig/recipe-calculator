import { describe, it, expect } from 'vitest';
import { calculateIngredients } from './calculator';
import type { Recipe } from '../hooks/useData';
import type { Ingredient } from '../data/ingredients';

describe('calculateIngredients', () => {
  const dummyIngredients: Ingredient[] = [
    { id: '1', name: 'グラニュー糖', type: 'normal' },
    { id: '2', name: '卵', type: 'normal' },
    { id: '3', name: '小麦粉', type: 'normal' },
    { id: '4', name: '特別いちご', type: 'special' },
  ];

  const dummyRecipes: Recipe[] = [
    {
      id: 'r1',
      name: 'スポンジケーキ',
      basePortions: 1,
      ingredients: [
        { ingredientId: '1', amountG: 50 },
        { ingredientId: '2', amountG: 100 },
        { ingredientId: '3', amountG: 70 },
      ]
    },
    {
      id: 'r2',
      name: 'いちごショート',
      basePortions: 5,
      ingredients: [
        { ingredientId: '1', amountG: 100 },
        { ingredientId: '4', amountG: 200 },
      ]
    }
  ];

  it('エントリがない場合は空配列を返す', () => {
    const result = calculateIngredients([], dummyRecipes, dummyIngredients);
    expect(result).toEqual([]);
  });

  it('1つのレシピで等倍（1人分）の計算が正しく行われる', () => {
    const entries = [{ recipeId: 'r1', portions: 1 }];
    const result = calculateIngredients(entries, dummyRecipes, dummyIngredients);

    expect(result).toHaveLength(3);
    expect(result.find(i => i.id === '1')?.calculatedAmountG).toBe(50);
    expect(result.find(i => i.id === '2')?.calculatedAmountG).toBe(100);
    expect(result.find(i => i.id === '3')?.calculatedAmountG).toBe(70);
  });

  it('1つのレシピで複数人分の計算（倍率計算）が正しく行われる', () => {
    const entries = [{ recipeId: 'r1', portions: 3 }];
    const result = calculateIngredients(entries, dummyRecipes, dummyIngredients);

    expect(result.find(i => i.id === '1')?.calculatedAmountG).toBe(150);
    expect(result.find(i => i.id === '2')?.calculatedAmountG).toBe(300);
    expect(result.find(i => i.id === '3')?.calculatedAmountG).toBe(210);
  });

  it('複数のレシピが選択されたとき、同じ材料は合算される', () => {
    const entries = [
      { recipeId: 'r1', portions: 1 }, // r1: base 1 -> ratio 1 -> ing1: 50
      { recipeId: 'r2', portions: 5 }, // r2: base 5 -> ratio 1 -> ing1: 100
    ];
    // ing1 sum = 150
    const result = calculateIngredients(entries, dummyRecipes, dummyIngredients);

    expect(result.find(i => i.id === '1')?.calculatedAmountG).toBe(150);
    expect(result.find(i => i.id === '4')?.calculatedAmountG).toBe(200);
  });

  it('レシピの分量が小数点倍率になる場合、小数点第一位で四捨五入される', () => {
    const entries = [{ recipeId: 'r2', portions: 2 }];
    // r2 base 5, portions 2 -> ratio 0.4
    // ing1: 100 * 0.4 = 40
    // ing4: 200 * 0.4 = 80
    const result = calculateIngredients(entries, dummyRecipes, dummyIngredients);

    expect(result.find(i => i.id === '1')?.calculatedAmountG).toBe(40);
    expect(result.find(i => i.id === '4')?.calculatedAmountG).toBe(80);
  });

  it('特別材料（special）が配列の先頭に来るようにソートされる', () => {
    const entries = [
      { recipeId: 'r1', portions: 1 }, // normal (1, 2, 3)
      { recipeId: 'r2', portions: 5 }, // normal (1), special (4)
    ];
    const result = calculateIngredients(entries, dummyRecipes, dummyIngredients);

    // 要素数は4（ing 1,2,3,4）
    expect(result).toHaveLength(4);
    // 先頭は必ず special
    expect(result[0].type).toBe('special');
    expect(result[0].id).toBe('4');
  });

  it('未知の材料IDが含まれている場合、Unknownとして扱われ処理が落ちない', () => {
    const recipes: Recipe[] = [
      {
        id: 'r_unknown',
        name: '謎のレシピ',
        basePortions: 1,
        ingredients: [
          { ingredientId: '999', amountG: 100 }
        ]
      }
    ];

    const entries = [{ recipeId: 'r_unknown', portions: 1 }];
    const result = calculateIngredients(entries, recipes, dummyIngredients);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('999');
    expect(result[0].name).toContain('Unknown');
    expect(result[0].calculatedAmountG).toBe(100);
  });
});
