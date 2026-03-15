import { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import type { Ingredient } from '../data/ingredients';

interface RecipeEntry {
  id: string; // 一意の入力枠ID
  recipeId: string;
  portions: number;
}

export function Calculator() {
  const { recipes, ingredients } = useData();
  const [entries, setEntries] = useState<RecipeEntry[]>([
    { id: Date.now().toString(), recipeId: '', portions: 1 }
  ]);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleAddEntry = () => {
    setEntries([...entries, { id: Date.now().toString(), recipeId: '', portions: 1 }]);
    setIsCalculated(false);
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    setIsCalculated(false);
  };

  const handleChangeEntry = (id: string, field: keyof RecipeEntry, value: string | number) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
    setIsCalculated(false);
  };

  // 選択されているすべての有効なエントリ
  const validEntries = useMemo(() => {
    return entries.filter(e => e.recipeId !== '' && e.portions > 0);
  }, [entries]);

  const handleCalculate = () => {
    if (validEntries.length > 0) setIsCalculated(true);
  };

  // 合算計算ロジック
  const calculatedItems = useMemo(() => {
    if (validEntries.length === 0) return [];
    
    // ingredientId をキーにしてグラム数を合算するマップ
    const sums = new Map<string, number>();

    validEntries.forEach(entry => {
      const recipe = recipes.find(r => r.id === entry.recipeId);
      if (!recipe) return;

      const ratio = entry.portions / recipe.basePortions;
      recipe.ingredients.forEach(ri => {
        const currentSum = sums.get(ri.ingredientId) || 0;
        sums.set(ri.ingredientId, currentSum + (ri.amountG * ratio));
      });
    });

    // マップから配列に変換し、Ingredient情報を付与
    const result = Array.from(sums.entries()).map(([ingId, sumAmount]) => {
      const ing = ingredients.find(i => i.id === ingId);
      return {
        ...ing,
        calculatedAmountG: Math.round(sumAmount * 10) / 10 // 小数点第1位まで
      };
    });

    // 名前順などでソートしておくと見やすい（特別材料を上に）
    result.sort((a, b) => {
      if (!a || !b) return 0;
      if (a.type !== b.type) return a.type === 'special' ? -1 : 1;
      const nameA = a.name || '';
      const nameB = b.name || '';
      return nameA.localeCompare(nameB, 'ja');
    });

    return result as (Ingredient & { calculatedAmountG: number })[];
  }, [validEntries, recipes, ingredients]);

  const handleShare = async () => {
    if (validEntries.length === 0) return;

    // ヘッダーテキストの作成
    const recipeNames = validEntries.map(e => {
      const r = recipes.find(rec => rec.id === e.recipeId);
      return r ? `${r.name}(${e.portions})` : '';
    }).filter(Boolean).join(', ');

    let text = `【材料合算リスト】\n対象: ${recipeNames}\n\n`;
    
    calculatedItems.forEach(item => {
      text += `・${item.type === 'special' ? '★ ' : ''}${item.name}: ${item.calculatedAmountG}g\n`;
      if (item.packageInfo) text += `  📦 ${item.packageInfo}\n`;
      if (item.notes) text += `  ⚠️ ${item.notes}\n`;
    });

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({
          title: '材料合算リスト',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert('クリップボードにコピーしました');
      }
    } catch (err) {
      console.error('Error sharing', err);
    }
  };

  const hasEmptyEntry = entries.some(e => e.recipeId === '');

  return (
    <div>
      <h2 className="text-lg font-bold mb-md">複数レシピ合算計算</h2>
      
      <div className="card mb-md">
        {entries.map((entry, index) => (
          <div key={entry.id} className="mb-md" style={{ borderBottom: index < entries.length - 1 ? '1px solid var(--color-border)' : 'none', paddingBottom: index < entries.length - 1 ? 'var(--spacing-md)' : 0 }}>
            <div className="flex justify-between items-center mb-sm">
              <span className="font-bold">レシピ {index + 1}</span>
              {entries.length > 1 && (
                <button 
                  className="btn btn-secondary text-xs" 
                  onClick={() => handleRemoveEntry(entry.id)}
                  style={{ padding: '0.25rem 0.5rem' }}
                >
                  削除
                </button>
              )}
            </div>

            <div className="form-group mb-sm">
              <select 
                className="input-base" 
                value={entry.recipeId} 
                onChange={(e) => handleChangeEntry(entry.id, 'recipeId', e.target.value)}
                style={{ marginBottom: 0 }}
              >
                <option value="">-- レシピを選択してください --</option>
                {recipes.map(r => (
                  <option key={r.id} value={r.id}>{r.name} (基準 {r.basePortions})</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-sm items-center">
              <span className="text-sm text-sub">人数・分量:</span>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.25rem 0.75rem' }}
                onClick={() => handleChangeEntry(entry.id, 'portions', Math.max(1, entry.portions - 1))}
              >-</button>
              <span className="font-bold text-lg" style={{ width: '40px', textAlign: 'center' }}>
                {entry.portions}
              </span>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.25rem 0.75rem' }}
                onClick={() => handleChangeEntry(entry.id, 'portions', entry.portions + 1)}
              >+</button>
            </div>
          </div>
        ))}

        <button 
          className="btn btn-secondary btn-block mb-md" 
          onClick={handleAddEntry}
          disabled={hasEmptyEntry}
        >
          ＋ 別のレシピを追加
        </button>

        <button 
          className="btn btn-primary btn-block" 
          onClick={handleCalculate}
          disabled={validEntries.length === 0}
        >
          合算して計算する
        </button>
      </div>

      {isCalculated && validEntries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-sm">
            <h3 className="font-bold text-lg">必要な全材料（合算）</h3>
            <button className="btn btn-secondary text-xs" onClick={handleShare}>
              {typeof navigator.share === 'function' ? '共有する' : 'コピーする'}
            </button>
          </div>
          
          <div className="flex-col gap-sm">
            {calculatedItems.map((item, idx) => {
              const isSpecial = item.type === 'special';
              
              return (
                <div key={idx} className={`card ${isSpecial ? 'special-card' : ''}`} style={{ marginBottom: 0 }}>
                  <div className="flex justify-between items-center mb-xs">
                    <span className="font-bold text-lg">
                      {isSpecial && '★ '}
                      {item.name}
                    </span>
                    <span className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
                      {item.calculatedAmountG} <span className="text-sm">g</span>
                    </span>
                  </div>
                  
                  {item.packageInfo && (
                    <div className="text-sm text-sub mt-xs">
                      📦 パッケージ情報: {item.packageInfo}
                    </div>
                  )}
                  
                  {item.notes && (
                    <div className="text-sm mt-xs">
                      <span className="badge badge-warning">注意</span> {item.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
