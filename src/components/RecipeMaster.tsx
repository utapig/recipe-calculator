import { useState } from 'react';
import { useData } from '../hooks/useData';
import type { Recipe, RecipeIngredient } from '../hooks/useData';

export function RecipeMaster() {
  const { recipes, saveRecipes, ingredients } = useData();
  const [isAdding, setIsAdding] = useState(false);

  // フォームステート
  const [name, setName] = useState('');
  const [basePortions, setBasePortions] = useState(1);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);

  const handleAddIngredient = () => {
    setRecipeIngredients([...recipeIngredients, { ingredientId: '', amountG: 0 }]);
  };

  const handleIngredientChange = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    const updated = [...recipeIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipeIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    const updated = recipeIngredients.filter((_, i) => i !== index);
    setRecipeIngredients(updated);
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // 빈 재료, 0g 재료 필터링
    const validIngredients = recipeIngredients.filter(
      ri => ri.ingredientId !== '' && ri.amountG > 0
    );

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: name.trim(),
      basePortions,
      ingredients: validIngredients,
    };

    saveRecipes([...recipes, newRecipe]);

    // リセット
    setName('');
    setBasePortions(1);
    setRecipeIngredients([]);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('このレシピを削除してもよろしいですか？')) {
      saveRecipes(recipes.filter(r => r.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-lg font-bold">レシピ管理 ({recipes.length}件)</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'キャンセル' : '＋ 新規追加'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSaveRecipe} className="card special-card mb-md">
          <h3 className="font-bold mb-md">新しいレシピを作成</h3>

          <div className="form-group">
            <label className="form-label">レシピ名</label>
            <input
              type="text"
              className="input-base"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: レアチーズケーキ"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">基準の人数（または個数・回数）</label>
            <div className="flex gap-sm items-center">
              <button type="button" className="btn btn-secondary" onClick={() => setBasePortions(Math.max(1, basePortions - 1))}>-</button>
              <span className="font-bold text-lg" style={{ width: '40px', textAlign: 'center' }}>{basePortions}</span>
              <button type="button" className="btn btn-secondary" onClick={() => setBasePortions(basePortions + 1)}>+</button>
            </div>
          </div>

          <div className="mb-md">
            <label className="form-label">必要な材料</label>
            {recipeIngredients.map((ri, idx) => (
              <div key={idx} className="flex gap-sm mb-sm items-center">
                <select
                  className="input-base"
                  style={{ flex: 2, marginBottom: 0 }}
                  value={ri.ingredientId}
                  onChange={e => handleIngredientChange(idx, 'ingredientId', e.target.value)}
                  required
                >
                  <option value="">材料を選択</option>
                  {ingredients.map(ing => (
                    <option key={ing.id} value={ing.id}>
                      {ing.type === 'special' ? '★ ' : ''}{ing.name}
                    </option>
                  ))}
                </select>

                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="number"
                    className="input-base"
                    style={{ marginBottom: 0 }}
                    value={ri.amountG || ''}
                    onChange={e => handleIngredientChange(idx, 'amountG', Number(e.target.value))}
                    placeholder="g"
                    min="1"
                    required
                  />
                </div>

                <button type="button" className="btn btn-secondary text-xs" onClick={() => handleRemoveIngredient(idx)}>
                  ✕
                </button>
              </div>
            ))}

            <button type="button" className="btn btn-secondary btn-block mt-sm" onClick={handleAddIngredient}>
              ＋ 材料を追加
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-block">レシピを保存</button>
        </form>
      )}

      <div className="flex-col gap-xs">
        {recipes.map(r => (
          <div key={r.id} className="card">
            <div className="flex justify-between items-center mb-sm">
              <h3 className="font-bold text-lg">{r.name}</h3>
              <button className="btn btn-secondary text-xs" onClick={() => handleDelete(r.id)} style={{ padding: '0.25rem 0.5rem' }}>
                削除
              </button>
            </div>
            <div className="text-sm text-sub mb-sm">基準: {r.basePortions} 人分 / 材料: {r.ingredients.length} 種類</div>

            <div style={{ background: 'var(--color-background)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)' }}>
              {r.ingredients.map((ri, idx) => {
                      const ingIdString = String(ri.ingredientId);
                      const ing = ingredients.find(i => String(i.id) === ingIdString);
                      return (
                        <div key={idx} className="text-sm flex justify-between border-b" style={{ borderBottomColor: 'var(--color-border)', paddingBottom: '4px', marginBottom: '4px' }}>
                          <span>{ing ? (ing.type === 'special' ? '★ ' : '') + ing.name : 'Unknown（ID: ' + ri.ingredientId + '）'}</span>
                          <span className="font-bold">{ri.amountG}g</span>
                        </div>
                      );
              })}
            </div>
          </div>
        ))}

        {recipes.length === 0 && !isAdding && (
          <div className="text-center text-sub mt-md">レシピがありません。新しいレシピを追加してください。</div>
        )}
      </div>
    </div>
  );
}
