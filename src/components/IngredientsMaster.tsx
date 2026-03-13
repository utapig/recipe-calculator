import { useState } from 'react';
import { useData } from '../hooks/useData';
import type { Ingredient, IngredientType } from '../data/ingredients';

export function IngredientsMaster() {
  const { ingredients, saveIngredients } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // 新規追加フォームのステート
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<IngredientType>('normal');
  const [newPackageInfo, setNewPackageInfo] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: newName.trim(),
      type: newType,
      packageInfo: newPackageInfo.trim() || undefined,
      notes: newNotes.trim() || undefined,
    };

    saveIngredients([...ingredients, newIngredient]);
    
    // リセット
    setNewName('');
    setNewType('normal');
    setNewPackageInfo('');
    setNewNotes('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('この材料を削除してもよろしいですか？')) {
      saveIngredients(ingredients.filter(i => i.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-lg font-bold">材料マスター ({ingredients.length}件)</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'キャンセル' : '＋ 新規追加'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="card special-card mb-md">
          <h3 className="font-bold mb-md">新しい材料を追加</h3>
          
          <div className="form-group">
            <label className="form-label">材料名</label>
            <input 
              type="text" 
              className="input-base" 
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              placeholder="例: ココアパウダー"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">種類（特別な材料はハイライトされます）</label>
            <select className="input-base" value={newType} onChange={e => setNewType(e.target.value as IngredientType)}>
              <option value="normal">通常材料</option>
              <option value="special">特別・注意 (★)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">パッケージ情報（補助表記用）</label>
            <input 
              type="text" 
              className="input-base" 
              value={newPackageInfo} 
              onChange={e => setNewPackageInfo(e.target.value)} 
              placeholder="例: 1ケース6本入り" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">注意書き</label>
            <input 
              type="text" 
              className="input-base" 
              value={newNotes} 
              onChange={e => setNewNotes(e.target.value)} 
              placeholder="例: 納期未定になりがち" 
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">保存する</button>
        </form>
      )}

      <div className="form-group">
        <input 
          type="text" 
          className="input-base" 
          placeholder="材料を検索..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-col gap-sm">
        {filteredIngredients.map(ing => (
          <div key={ing.id} className={`card ${ing.type === 'special' ? 'special-card' : ''}`}>
            <div className="flex justify-between items-center mb-xs">
              <span className="font-bold">
                {ing.type === 'special' && '★ '}
                {ing.name}
              </span>
              <button 
                className="btn btn-secondary text-xs" 
                onClick={() => handleDelete(ing.id)}
                style={{ padding: '0.25rem 0.5rem' }}
              >
                削除
              </button>
            </div>
            
            {ing.packageInfo && (
              <div className="text-sm text-sub">📦 {ing.packageInfo}</div>
            )}
            
            {ing.notes && (
              <div className="text-sm text-sub mt-xs">
                <span className="badge badge-warning">注意</span> {ing.notes}
              </div>
            )}
          </div>
        ))}

        {filteredIngredients.length === 0 && (
          <div className="text-center text-sub mt-md">該当する材料がありません。</div>
        )}
      </div>
    </div>
  );
}
