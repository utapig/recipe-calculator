import { useState } from 'react';
import { IngredientsMaster } from './components/IngredientsMaster';
import { RecipeMaster } from './components/RecipeMaster';
import { Calculator } from './components/Calculator';

type Tab = 'calc' | 'recipes' | 'ingredients';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calc');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>料理レシピ材料計算</h1>
      </header>
      
      <main className="app-main">
        {activeTab === 'calc' && <Calculator />}
        {activeTab === 'recipes' && <RecipeMaster />}
        {activeTab === 'ingredients' && <IngredientsMaster />}
      </main>

      <nav className="app-bottom-nav">
        <button 
          className={`btn ${activeTab === 'calc' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('calc')}
          style={{ flex: 1, margin: '0 4px' }}
        >
          計算
        </button>
        <button 
          className={`btn ${activeTab === 'recipes' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('recipes')}
          style={{ flex: 1, margin: '0 4px' }}
        >
          レシピ
        </button>
        <button 
          className={`btn ${activeTab === 'ingredients' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('ingredients')}
          style={{ flex: 1, margin: '0 4px' }}
        >
          材料
        </button>
      </nav>
    </div>
  );
}

export default App;
