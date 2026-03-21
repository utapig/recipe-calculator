import { describe, it, expect } from 'vitest';
import { calculateIngredients } from './calculator';
import type { Recipe } from '../hooks/useData';
import type { Ingredient } from '../data/ingredients';
import { INITIAL_RECIPES } from '../data/recipes';
import { INITIAL_INGREDIENTS } from '../data/ingredients';

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

  describe('recipes.mdのレシピを参考にした複雑なシナリオ', () => {
    
    it('複数のコンポーネントレシピを組み合わせた場合、全材料が正しく合算される', () => {
      // ケーキ本体とアールグレイムースの2つのレシピを組み合わせるシナリオ
      const recipes: Recipe[] = [
        {
          id: 'cake_base',
          name: 'ケーキ生地',
          basePortions: 1,
          ingredients: [
            { ingredientId: '7', amountG: 840 }, // 全卵
            { ingredientId: '1', amountG: 450 }, // グラニュー糖
            { ingredientId: '4', amountG: 500 }, // 薄力粉
          ]
        },
        {
          id: 'earl_mousse',
          name: 'アールグレイムース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '1', amountG: 556 }, // グラニュー糖（重複）
            { ingredientId: '10', amountG: 18 }, // 板ゼラチン
          ]
        }
      ];

      const ingredients: Ingredient[] = [
        { id: '1', name: 'グラニュー糖', type: 'normal' },
        { id: '4', name: '薄力粉', type: 'normal' },
        { id: '7', name: '全卵', type: 'normal' },
        { id: '10', name: '板ゼラチン', type: 'normal' },
      ];

      const entries = [
        { recipeId: 'cake_base', portions: 1 },
        { recipeId: 'earl_mousse', portions: 1 }
      ];

      const result = calculateIngredients(entries, recipes, ingredients);

      // グラニュー糖はケーキと ムースの両方に含まれるため合算される
      expect(result.find(i => i.id === '1')?.calculatedAmountG).toBe(1006); // 450 + 556
      expect(result.find(i => i.id === '4')?.calculatedAmountG).toBe(500);
      expect(result.find(i => i.id === '7')?.calculatedAmountG).toBe(840);
      expect(result.find(i => i.id === '10')?.calculatedAmountG).toBe(18);
    });

    it('basePortionsが1より大きいレシピの複数人分計算が正しく行われる', () => {
      // basePortions=5のレシピを10人分（2倍）オーダーする場合
      const recipes: Recipe[] = [
        {
          id: 'mousse_set',
          name: 'ムースセット',
          basePortions: 5, // 5個分が基本
          ingredients: [
            { ingredientId: '1', amountG: 100 },
            { ingredientId: '75', amountG: 273 }, // フランボワーズピューレ
          ]
        }
      ];

      const ingredients: Ingredient[] = [
        { id: '1', name: 'グラニュー糖', type: 'normal' },
        { id: '75', name: 'フランボワーズピューレ', type: 'normal' },
      ];

      // 10人分注文 -> ratio = 10/5 = 2
      const entries = [{ recipeId: 'mousse_set', portions: 10 }];
      const result = calculateIngredients(entries, recipes, ingredients);

      expect(result.find(i => i.id === '1')?.calculatedAmountG).toBe(200); // 100 * 2
      expect(result.find(i => i.id === '75')?.calculatedAmountG).toBe(546); // 273 * 2
    });

    it('小数点倍率計算で正しく四捨五入される（recipes.mdのような分量計算）', () => {
      const recipes: Recipe[] = [
        {
          id: 'complex_recipe',
          name: '複雑なレシピ',
          basePortions: 6,
          ingredients: [
            { ingredientId: '1', amountG: 45 }, // グラニュー糖
            { ingredientId: '9', amountG: 69 }, // 卵黄
            { ingredientId: '30', amountG: 127 }, // はちみつ
          ]
        }
      ];

      const ingredients: Ingredient[] = [
        { id: '1', name: 'グラニュー糖', type: 'normal' },
        { id: '9', name: '卵黄', type: 'normal' },
        { id: '30', name: 'はちみつ', type: 'normal' },
      ];

      // 4人分注文 -> ratio = 4/6 = 0.6666...
      const entries = [{ recipeId: 'complex_recipe', portions: 4 }];
      const result = calculateIngredients(entries, recipes, ingredients);

      // 45 * 0.6666... = 30
      expect(result.find(i => i.id === '1')?.calculatedAmountG).toBe(30);
      // 69 * 0.6666... = 46
      expect(result.find(i => i.id === '9')?.calculatedAmountG).toBe(46);
      // 127 * 0.6666... = 84.6666... -> 84.7
      expect(result.find(i => i.id === '30')?.calculatedAmountG).toBe(84.7);
    });

    it('大量の材料を含むレシピの計算が正確に行われる', () => {
      // 【スタンダード喫食ケーキ】のような複数の材料を持つレシピ
      const recipes: Recipe[] = [
        {
          id: 'large_cake',
          name: '【スタンダード喫食ケーキ】 1段サンド',
          basePortions: 1,
          ingredients: [
            { ingredientId: '117', amountG: 840 },
            { ingredientId: '118', amountG: 190 },
            { ingredientId: '119', amountG: 450 },
            { ingredientId: '120', amountG: 45 },
            { ingredientId: '121', amountG: 500 },
            { ingredientId: '122', amountG: 75 },
            { ingredientId: '123', amountG: 125 },
            { ingredientId: '124', amountG: 86 },
            { ingredientId: '125', amountG: 43 },
            { ingredientId: '126', amountG: 43 },
            { ingredientId: '127', amountG: 128 },
          ]
        }
      ];

      const ingredients: Ingredient[] = Array.from({ length: 11 }, (_, i) => ({
        id: String(117 + i),
        name: `材料${117 + i}`,
        type: 'normal' as const
      }));

      const entries = [{ recipeId: 'large_cake', portions: 1 }];
      const result = calculateIngredients(entries, recipes, ingredients);
      const expectedById: Record<string, number> = {
        '117': 840,
        '118': 190,
        '119': 450,
        '120': 45,
        '121': 500,
        '122': 75,
        '123': 125,
        '124': 86,
        '125': 43,
        '126': 43,
        '127': 128,
      };

      // 11個の材料がすべて計算される
      expect(result).toHaveLength(11);
      for (const [id, amount] of Object.entries(expectedById)) {
        expect(result.find(i => i.id === id)?.calculatedAmountG).toBe(amount);
      }
      const totalAmount = result.reduce((sum, item) => sum + item.calculatedAmountG, 0);
      expect(totalAmount).toBe(2525); // 全量の合計
    });

    it('複数の同じレシピが異なる分量で選択された場合', () => {
      const recipes: Recipe[] = [
        {
          id: 'caramel_sauce',
          name: 'キャラメルソース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '1', amountG: 300 }, // グラニュー糖
          ]
        }
      ];

      const ingredients: Ingredient[] = [
        { id: '1', name: 'グラニュー糖', type: 'normal' },
      ];

      // 同じレシピを2回異なる分量で注文
      const entries = [
        { recipeId: 'caramel_sauce', portions: 1 },
        { recipeId: 'caramel_sauce', portions: 2 }
      ];

      const result = calculateIngredients(entries, recipes, ingredients);

      // 1 + 2倍 = 3*(300) = 900
      expect(result).toHaveLength(1);
      expect(result[0].calculatedAmountG).toBe(900);
    });

    it('存在しないレシピIDはスキップされる', () => {
      const recipes: Recipe[] = [
        {
          id: 'valid_recipe',
          name: '有効なレシピ',
          basePortions: 1,
          ingredients: [
            { ingredientId: '1', amountG: 100 }
          ]
        }
      ];

      const ingredients: Ingredient[] = [
        { id: '1', name: 'グラニュー糖', type: 'normal' },
      ];

      const entries = [
        { recipeId: 'valid_recipe', portions: 1 },
        { recipeId: 'invalid_recipe', portions: 5 } // 存在しないID
      ];

      const result = calculateIngredients(entries, recipes, ingredients);

      // 有効なレシピのみが処理される
      expect(result).toHaveLength(1);
      expect(result[0].calculatedAmountG).toBe(100);
    });

    it('材料が日本語でソートされる（五十音順）', () => {
      const recipes: Recipe[] = [
        {
          id: 'sort_test',
          name: 'ソートテスト',
          basePortions: 1,
          ingredients: [
            { ingredientId: '1', amountG: 100 }, // あ
            { ingredientId: '2', amountG: 100 }, // さ
            { ingredientId: '3', amountG: 100 }, // か
          ]
        }
      ];

      const ingredients: Ingredient[] = [
        { id: '1', name: 'あんず', type: 'normal' },
        { id: '2', name: 'さとう', type: 'normal' },
        { id: '3', name: 'かおり', type: 'normal' },
      ];

      const entries = [{ recipeId: 'sort_test', portions: 1 }];
      const result = calculateIngredients(entries, recipes, ingredients);

      // 五十音順でソートされている
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('あんず');
      expect(result[1].name).toBe('かおり');
      expect(result[2].name).toBe('さとう');
    });

    it('小数点計算で精密度が保たれる（複数の小数計算の累積）', () => {
      const recipes: Recipe[] = [
        {
          id: 'precision_test1',
          name: 'レシピ1',
          basePortions: 3,
          ingredients: [
            { ingredientId: '1', amountG: 111 }
          ]
        },
        {
          id: 'precision_test2',
          name: 'レシピ2',
          basePortions: 7,
          ingredients: [
            { ingredientId: '1', amountG: 222 }
          ]
        }
      ];

      const ingredients: Ingredient[] = [
        { id: '1', name: 'グラニュー糖', type: 'normal' },
      ];

      // レシピ1: 1/3 * 111 = 37
      // レシピ2: 2/7 * 222 = 63.428... ~ 63.4
      const entries = [
        { recipeId: 'precision_test1', portions: 1 },
        { recipeId: 'precision_test2', portions: 2 }
      ];

      const result = calculateIngredients(entries, recipes, ingredients);

      expect(result).toHaveLength(1);
      // 37 + 63.4 = 100.4
      expect(result[0].calculatedAmountG).toBe(100.4);
    });
  });

  describe('recipes.md由来の実データテスト', () => {
    it('recipe_001を1倍で計算すると、同一材料IDは合算される', () => {
      const entries = [{ recipeId: 'recipe_001', portions: 1 }];
      const result = calculateIngredients(entries, INITIAL_RECIPES, INITIAL_INGREDIENTS);
      const expectedById: Record<string, number> = {
        '118': 840,
        '119': 190,
        '120': 450,
        '121': 45,
        '122': 500,
        '123': 75,
        '164': 125,
        '125': 86,
        '126': 43,
        '127': 129,
        '128': 128,
        '129': 540,
        '130': 540,
        '131': 800,
      };

      expect(result).toHaveLength(14);
      for (const [id, amount] of Object.entries(expectedById)) {
        expect(result.find(i => i.id === id)?.calculatedAmountG).toBe(amount);
      }
    });

    it('異なるレシピを組み合わせたとき、共通材料IDが正しく合算される', () => {
      const entries = [
        { recipeId: 'recipe_001', portions: 1 },
        { recipeId: 'recipe_004', portions: 1 },
      ];
      const result = calculateIngredients(entries, INITIAL_RECIPES, INITIAL_INGREDIENTS);

      expect(result.find(i => i.id === '164')?.calculatedAmountG).toBe(525);
      expect(result.find(i => i.id === '141')?.calculatedAmountG).toBe(18);
    });

    it('実データ内の材料ID参照はすべて材料マスタで解決できる', () => {
      const entries = INITIAL_RECIPES.map(recipe => ({ recipeId: recipe.id, portions: recipe.basePortions }));
      const result = calculateIngredients(entries, INITIAL_RECIPES, INITIAL_INGREDIENTS);

      const unknownItems = result.filter(item => item.name.startsWith('Unknown（ID:'));
      expect(unknownItems).toHaveLength(0);
    });
  });
});
