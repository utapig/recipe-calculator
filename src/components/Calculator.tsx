import { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';

export function Calculator() {
  const { recipes, ingredients } = useData();
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [targetPortions, setTargetPortions] = useState(1);
  const [isCalculated, setIsCalculated] = useState(false);

  const selectedRecipe = useMemo(() => {
    return recipes.find(r => r.id === selectedRecipeId);
  }, [recipes, selectedRecipeId]);

  const handleCalculate = () => {
    if (selectedRecipeId) setIsCalculated(true);
  };

  const calculatedItems = useMemo(() => {
    if (!selectedRecipe) return [];
    const ratio = targetPortions / selectedRecipe.basePortions;
    
    return selectedRecipe.ingredients.map(ri => {
      const ing = ingredients.find(i => i.id === ri.ingredientId);
      return {
        ...ing,
        calculatedAmountG: Math.round(ri.amountG * ratio * 10) / 10 // 小数点第1位まで
      };
    });
  }, [selectedRecipe, targetPortions, ingredients]);

  const handleShare = async () => {
    if (!selectedRecipe) return;

    let text = `【材料リスト: ${selectedRecipe.name}】（${targetPortions}人分/回分）\n\n`;
    calculatedItems.forEach(item => {
      if (!item) return;
      text += `・${item.type === 'special' ? '★ ' : ''}${item.name}: ${item.calculatedAmountG}g\n`;
      if (item.packageInfo) text += `  📦 ${item.packageInfo}\n`;
      if (item.notes) text += `  ⚠️ ${item.notes}\n`;
    });

    try {
      if (navigator.share) {
        await navigator.share({
          title: `材料リスト: ${selectedRecipe.name}`,
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

  // レシピ変更時は計算結果をリセット
  const onChangeRecipe = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecipeId(e.target.value);
    setIsCalculated(false);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-md">レシピから材料計算</h2>
      
      <div className="card mb-md">
        <div className="form-group">
          <label className="form-label">レシピを選択</label>
          <select className="input-base" value={selectedRecipeId} onChange={onChangeRecipe}>
            <option value="">-- レシピを選択してください --</option>
            {recipes.map(r => (
              <option key={r.id} value={r.id}>{r.name} (基準: {r.basePortions})</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">何人分 (または何回分) 作りますか？</label>
          <div className="flex gap-sm items-center">
            <button 
              className="btn btn-secondary" 
              onClick={() => { setTargetPortions(Math.max(1, targetPortions - 1)); setIsCalculated(false); }}
            >-</button>
            <span className="font-bold text-lg" style={{ width: '40px', textAlign: 'center' }}>
              {targetPortions}
            </span>
            <button 
              className="btn btn-secondary" 
              onClick={() => { setTargetPortions(targetPortions + 1); setIsCalculated(false); }}
            >+</button>
          </div>
        </div>

        <button 
          className="btn btn-primary btn-block" 
          onClick={handleCalculate}
          disabled={!selectedRecipeId}
        >
          計算する
        </button>
      </div>

      {isCalculated && selectedRecipe && (
        <div>
          <div className="flex justify-between items-center mb-sm">
            <h3 className="font-bold text-lg">必要な材料リスト</h3>
            <button className="btn btn-secondary text-xs" onClick={handleShare}>
              {typeof navigator.share === 'function' ? '共有する' : 'コピーする'}
            </button>
          </div>
          
          <div className="flex-col gap-sm">
            {calculatedItems.map((item, idx) => {
              if (!item) return null;
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
