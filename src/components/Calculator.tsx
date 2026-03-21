import { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { calculateIngredients } from '../utils/calculator';
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
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

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

  // 合算計算ロジック（別ファイルに分離した純粋関数を使用）
  const calculatedItems = useMemo(() => {
    return calculateIngredients(validEntries, recipes, ingredients);
  }, [validEntries, recipes, ingredients]);

  const handleCopyText = async () => {
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
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 1800);
    } catch (err) {
      console.error('Error copying text', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 1800);
    }
  };

  const hasEmptyEntry = entries.some(e => e.recipeId === '');

  return (
    <div>
      <h2 className="text-sm font-bold mb-sm">複数レシピ合算計算</h2>

      <div className="card" style={{ padding: 'var(--spacing-sm)' }}>
        {entries.map((entry, index) => (
          <div key={entry.id} className="calc-entry-row" style={{ borderBottom: index < entries.length - 1 ? '1px solid var(--color-border)' : 'none', paddingBottom: index < entries.length - 1 ? '0.4rem' : 0, marginBottom: index < entries.length - 1 ? '0.4rem' : 0 }}>
            <div className="flex gap-sm items-center" style={{ marginBottom: '0.25rem' }}>
              <span className="text-xs text-sub" style={{ minWidth: '1.5rem' }}>#{index + 1}</span>
              <select
                className="input-base"
                value={entry.recipeId}
                onChange={(e) => handleChangeEntry(entry.id, 'recipeId', e.target.value)}
                style={{ marginBottom: 0, fontSize: '0.8rem', padding: '0.25rem 0.35rem' }}
              >
                <option value="">-- レシピを選択 --</option>
                {recipes.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.basePortions})</option>
                ))}
              </select>
              <div className="flex items-center gap-sm" style={{ flexShrink: 0 }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}
                  onClick={() => handleChangeEntry(entry.id, 'portions', Math.max(1, entry.portions - 1))}
                >-</button>
                <span className="font-bold" style={{ width: '28px', textAlign: 'center', fontSize: '0.9rem' }}>
                  {entry.portions}
                </span>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}
                  onClick={() => handleChangeEntry(entry.id, 'portions', entry.portions + 1)}
                >+</button>
              </div>
              {entries.length > 1 && (
                <button
                  className="btn-icon-delete"
                  onClick={() => handleRemoveEntry(entry.id)}
                  title="削除"
                >✕</button>
              )}
            </div>
          </div>
        ))}

        <div className="flex gap-sm" style={{ marginTop: '0.4rem' }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.3rem', fontSize: '0.8rem' }}
            onClick={handleAddEntry}
            disabled={hasEmptyEntry}
          >
            ＋ 追加
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.3rem', fontSize: '0.8rem' }}
            onClick={handleCalculate}
            disabled={validEntries.length === 0}
          >
            合算計算
          </button>
        </div>
      </div>

      {isCalculated && validEntries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-sm">
            <h3 className="font-bold text-sm">必要な全材料（合算）</h3>
            <div className="flex items-center gap-sm">
              {copyStatus === 'copied' && <span className="text-xs text-sub">コピーしました</span>}
              {copyStatus === 'error' && <span className="text-xs text-sub">コピーに失敗しました</span>}
              <button className="btn btn-secondary text-xs" onClick={handleCopyText} style={{ padding: '0.2rem 0.5rem', margin: '0.15rem 0' }}>
                テキストをコピー
              </button>
            </div>
          </div>

          <div className="ingredient-table">
            <div className="ingredient-table-header">
              <span className="calc-col-name">材料名</span>
              <span className="calc-col-amount">分量</span>
            </div>
            {calculatedItems.map((item, idx) => {
              const isSpecial = item.type === 'special';
              const noteText = [
                item.packageInfo ? `📦${item.packageInfo}` : '',
                item.notes ? `⚠${item.notes}` : ''
              ].filter(Boolean).join(' / ');
              return (
                <div key={idx} className={`ingredient-row calc-result-row ${isSpecial ? 'ingredient-row-special' : ''}`}>
                  <div className="calc-col-name">
                    <div>
                      {isSpecial && <span style={{ color: 'var(--color-special-text)' }}>★ </span>}
                      {item.name}
                    </div>
                    {noteText && <div className="calc-col-note text-xs text-sub">{noteText}</div>}
                  </div>
                  <span className="calc-col-amount font-bold" style={{ color: 'var(--color-primary)' }}>
                    {item.calculatedAmountG}g
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
