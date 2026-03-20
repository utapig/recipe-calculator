export interface RecipeIngredient {
  ingredientId: string;
  amountG: number;
}

export interface Recipe {
  id: string;
  name: string;
  basePortions: number;
  ingredients: RecipeIngredient[];
}

import { useState, useEffect } from 'react';
import { INITIAL_INGREDIENTS } from '../data/ingredients';
import type { Ingredient } from '../data/ingredients';

const STORAGE_KEY_INGREDIENTS = 'recipe_calc_ingredients';
const STORAGE_KEY_RECIPES = 'recipe_calc_recipes';

// test
export function useData() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // ロード処理
  useEffect(() => {
    const storedIngredients = localStorage.getItem(STORAGE_KEY_INGREDIENTS);
    if (storedIngredients) {
      const parsed = JSON.parse(storedIngredients) as Ingredient[];
      // 初期データが増えている場合、新しいものを追加（ID重複チェック）
      const newIngredients = INITIAL_INGREDIENTS.filter(
        initialIng => !parsed.some(storedIng => storedIng.id === initialIng.id)
      );
      if (newIngredients.length > 0) {
        const merged = [...parsed, ...newIngredients];
        setIngredients(merged);
        localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(merged));
      } else {
        setIngredients(parsed);
      }
    } else {
      // 初回起動時はINITIAL_INGREDIENTSをセット
      setIngredients(INITIAL_INGREDIENTS);
      localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(INITIAL_INGREDIENTS));
    }

    const storedRecipes = localStorage.getItem(STORAGE_KEY_RECIPES);
    if (storedRecipes) {
      const parsedRecipes = JSON.parse(storedRecipes) as Recipe[];
      if (parsedRecipes.length > 0) {
        setRecipes(parsedRecipes);
      } else {
        // 保存されていても0件の場合は初期データをセットする
        const initialRecipes: Recipe[] = [
        {
          id: 'recipe_cake_60',
          name: '【スタンダード喫食ケーキ】 1段サンド',
          basePortions: 60,
          ingredients: [
            { ingredientId: '117', amountG: 840 }, // 籠谷 殺菌凍結全卵（奥丹波の卵）
            { ingredientId: '118', amountG: 190 }, // QP 加糖凍結卵黄20%
            { ingredientId: '119', amountG: 450 }, // 上白糖スプーン印
            { ingredientId: '120', amountG: 45 },  // F 向後 ヤマコーソ（水飴）
            { ingredientId: '121', amountG: 500 }, // 日清スーパーバイオレット
            { ingredientId: '122', amountG: 75 },  // 北海道凍結バター
            { ingredientId: '123', amountG: 125 }, // ベーシックミルク
            { ingredientId: '124', amountG: 86 },  // ダルボエルダーフラワーシロップ
            { ingredientId: '125', amountG: 43 },  // 浄水A
            { ingredientId: '126', amountG: 43 },  // フジ日本 グラニュー糖FNGS
            { ingredientId: '127', amountG: 128 }, // 浄水B
            { ingredientId: '128', amountG: 540 }, // 北海道クリーム（根釧）42%
            { ingredientId: '129', amountG: 540 }, // クレームルール41%
            { ingredientId: '126', amountG: 86 },  // フジ日本 グラニュー糖FNGS (2回目追加分)
            { ingredientId: '130', amountG: 800 }  // サンド用苺A
          ]
        },
        {
          id: 'recipe_hibiscus_mousse',
          name: 'ハイビスカス香る アールグレイとミルクショコラのムース',
          basePortions: 1, // （特に指定がないが10個ベースの材料になっている？）一旦「個数」は分量で調整するものとし、ベースを1とみなすか材料側で規定
          ingredients: [
            { ingredientId: '183', amountG: 10 }, // アールグレイムース (10個)
            { ingredientId: '131', amountG: 10 }, // ヘーゼルナッツキャラメリゼ (10粒)
            { ingredientId: '132', amountG: 20 }, // シャンティ
            { ingredientId: '133', amountG: 50 }, // チーズソース
            { ingredientId: '134', amountG: 10 }, // 素材のミルク (10個)
            { ingredientId: '135', amountG: 5 },  // クーリーフランボワーズ
            { ingredientId: '136', amountG: 5 },  // フランボワーズ (5個)
            { ingredientId: '137', amountG: 10 }, // セルフィーユ (10枚)
            { ingredientId: '138', amountG: 20 }  // ベルローズ (20枚)
          ]
        },
        {
          id: 'recipe_earl',
          name: 'アールグレイムース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '139', amountG: 556 }, // ベルコラーデ レ アンタンス
            { ingredientId: '140', amountG: 18 },  // ドイツ製ゼラチンゴールドエキストラ
            { ingredientId: '141', amountG: 400 }, // タカナシBasicMILK
            { ingredientId: '142', amountG: 54 },  // トワイニング アールグレイ
            { ingredientId: '143', amountG: 760 }  // 生クリーム 38%
          ]
        },
        {
          id: 'recipe_hibiscus_center',
          name: 'ハイビスカスセンター',
          basePortions: 1,
          ingredients: [
            { ingredientId: '144', amountG: 336 }, // 浄水
            { ingredientId: '145', amountG: 12 },  // 日本緑茶 ハイビスカス#153
            { ingredientId: '140', amountG: 10 },  // ドイツ製ゼラチンゴールドエキストラ
            { ingredientId: '126', amountG: 50 },  // フジ日本精糖 FNGS グラニュー糖
            { ingredientId: '146', amountG: 50 }   // シコリ 冷凍フランボワーズピューレ 加糖
          ]
        },
        {
          id: 'recipe_cheese_source',
          name: 'チーズソース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '147', amountG: 220 }, // タカナシクリームチーズ
            { ingredientId: '148', amountG: 292.6 }, // パティシエールA
            { ingredientId: '149', amountG: 72.6 },  // lait
            { ingredientId: '150', amountG: 4.62 }   // ドイツ板ゼラチンゴールド
          ]
        },
        {
          id: 'recipe_choc_comp',
          name: 'ショコラとグリオットチェリーのコンポジション',
          basePortions: 100,
          ingredients: [
            { ingredientId: '151', amountG: 52 }, // チョコレートムース
            { ingredientId: '152', amountG: 22 }, // 業務用ミルクアイス
            { ingredientId: '153', amountG: 7 },  // チェリーソース
            { ingredientId: '154', amountG: 4 },  // ミント
            { ingredientId: '155', amountG: 15 }, // チョコ飾り
            { ingredientId: '156', amountG: 3 },  // ホワイトチョコパウダー
            { ingredientId: '157', amountG: 2 }   // チェリーコンポート
          ]
        },
        {
          id: 'recipe_dessert1',
          name: 'デセールセット①',
          basePortions: 1,
          ingredients: [
            { ingredientId: '158', amountG: 1445 }, // ボワロン クレモンティーヌピューレ
            { ingredientId: '1', amountG: 296 },    // グラニュー糖
            { ingredientId: '144', amountG: 828 },  // 浄水
            { ingredientId: '159', amountG: 425 }   // LLオレンジ100%
          ]
        },
        {
          id: 'recipe_dessert_kiji',
          name: 'デセールルセット① 生地',
          basePortions: 1,
          ingredients: [
            { ingredientId: '160', amountG: 159 }, // クリーンパック鶏卵
            { ingredientId: '1', amountG: 106 },   // グラニュー糖
            { ingredientId: '161', amountG: 79 },  // スーパーバイオレット
            { ingredientId: '162', amountG: 13 },  // サンエイト オリジナルココア
            { ingredientId: '163', amountG: 26 },  // サラダ油
            { ingredientId: '164', amountG: 12.5 } // タカナシ ベーシックミルク
          ]
        },
        {
          id: 'recipe_dessert_center',
          name: 'デセールルセット センター',
          basePortions: 1,
          ingredients: [
            { ingredientId: '165', amountG: 432 }, // ポワロン グリオットチェリーホール
            { ingredientId: '166', amountG: 1000 },// フルティエ コレチェリー
            { ingredientId: '1', amountG: 260 },   // グラニュー糖
            { ingredientId: '167', amountG: 13 }   // アイスクリームペクチン
          ]
        },
        {
          id: 'recipe_dessert3_mousse',
          name: 'デセールルセット③ チョコレートムース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '168', amountG: 756 }, // ヴァローナ エキストラビター
            { ingredientId: '169', amountG: 378 }, // カレボー3815
            { ingredientId: '164', amountG: 655 }, // タカナシ ベーシックミルク
            { ingredientId: '170', amountG: 655 }, // 新スーパーフレッシュ36% (1)
            { ingredientId: '171', amountG: 328 }, // 加納卵黄
            { ingredientId: '1', amountG: 88 },    // グラニュー糖
            { ingredientId: '170', amountG: 1424 },// 新スーパーフレッシュ36% (2)
            { ingredientId: '172', amountG: 38 }   // ドイツゼラチン
          ]
        },
        {
          id: 'recipe_dessert_comp',
          name: 'デセールセット チェリーコンポート',
          basePortions: 1,
          ingredients: [
            { ingredientId: '173', amountG: 300 }, // ボワロン グリオットチェリーホール
            { ingredientId: '1', amountG: 100 },   // グラニュー糖
            { ingredientId: '144', amountG: 200 }, // 浄水
            { ingredientId: '174', amountG: 50 }   // フルティエ モレロチェリー
          ]
        },
        {
          id: 'recipe_dessert_choco_deco',
          name: 'デセールセット飾りチョコ',
          basePortions: 1,
          ingredients: [
            { ingredientId: '84', amountG: 50 },   // ロイヤルティーヌ
            { ingredientId: '175', amountG: 100 }, // カルボーW2カレット
            { ingredientId: '176', amountG: 35 },  // カルボー3815
            { ingredientId: '177', amountG: 10 }   // PCB チョコレート用色素 苺
          ]
        },
        {
          id: 'recipe_dessert_cherry_source',
          name: 'デセールセット チェリーソース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '178', amountG: 64 },  // フルティエ ラズベリー
            { ingredientId: '174', amountG: 256 }, // フルティエ モレロチェリー
            { ingredientId: '1', amountG: 32 },    // グラニュー糖
            { ingredientId: '179', amountG: 3.2 }, // アイコクLMペクチン
            { ingredientId: '14', amountG: 160 }   // スブリモ
          ]
        },
        {
          id: 'recipe_dessert_white_powder',
          name: 'デセールセット ホワイトチョコパウダー',
          basePortions: 1,
          ingredients: [
            { ingredientId: '175', amountG: 50 },  // カルボーW2カレット
            { ingredientId: '83', amountG: 15 }    // マルトセック
          ]
        },
        {
          id: 'recipe_dessert1_v2',
          name: 'デセールセット① (Ver.2)', // 最後の重複レシピ名区別用
          basePortions: 1,
          ingredients: [
            { ingredientId: '180', amountG: 1000 },// ボワロン ミラベルピューレ
            { ingredientId: '1', amountG: 400 },   // グラニュー糖
            { ingredientId: '181', amountG: 100 }, // エルダーフラワーシロップ
            { ingredientId: '182', amountG: 50 },  // ボワロン ベルガモットピューレ
            { ingredientId: '144', amountG: 2000 } // 浄水
          ]
        }
      ];
      setRecipes(initialRecipes);
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(initialRecipes));
      }
    } else {
      // 完全に保存されていない場合の初期化
      const initialRecipes: Recipe[] = [
        {
          id: 'recipe_cake_60',
          name: '【スタンダード喫食ケーキ】 1段サンド',
          basePortions: 60,
          ingredients: [
            { ingredientId: '117', amountG: 840 }, // 籠谷 殺菌凍結全卵（奥丹波の卵）
            { ingredientId: '118', amountG: 190 }, // QP 加糖凍結卵黄20%
            { ingredientId: '119', amountG: 450 }, // 上白糖スプーン印
            { ingredientId: '120', amountG: 45 },  // F 向後 ヤマコーソ（水飴）
            { ingredientId: '121', amountG: 500 }, // 日清スーパーバイオレット
            { ingredientId: '122', amountG: 75 },  // 北海道凍結バター
            { ingredientId: '123', amountG: 125 }, // ベーシックミルク
            { ingredientId: '124', amountG: 86 },  // ダルボエルダーフラワーシロップ
            { ingredientId: '125', amountG: 43 },  // 浄水A
            { ingredientId: '126', amountG: 43 },  // フジ日本 グラニュー糖FNGS
            { ingredientId: '127', amountG: 128 }, // 浄水B
            { ingredientId: '128', amountG: 540 }, // 北海道クリーム（根釧）42%
            { ingredientId: '129', amountG: 540 }, // クレームルール41%
            { ingredientId: '126', amountG: 86 },  // フジ日本 グラニュー糖FNGS (2回目追加分)
            { ingredientId: '130', amountG: 800 }  // サンド用苺A
          ]
        },
        {
          id: 'recipe_hibiscus_mousse',
          name: 'ハイビスカス香る アールグレイとミルクショコラのムース',
          basePortions: 1, // （特に指定がないが10個ベースの材料になっている？）一旦「個数」は分量で調整するものとし、ベースを1とみなすか材料側で規定
          ingredients: [
            { ingredientId: '183', amountG: 10 }, // アールグレイムース (10個)
            { ingredientId: '131', amountG: 10 }, // ヘーゼルナッツキャラメリゼ (10粒)
            { ingredientId: '132', amountG: 20 }, // シャンティ
            { ingredientId: '133', amountG: 50 }, // チーズソース
            { ingredientId: '134', amountG: 10 }, // 素材のミルク (10個)
            { ingredientId: '135', amountG: 5 },  // クーリーフランボワーズ
            { ingredientId: '136', amountG: 5 },  // フランボワーズ (5個)
            { ingredientId: '137', amountG: 10 }, // セルフィーユ (10枚)
            { ingredientId: '138', amountG: 20 }  // ベルローズ (20枚)
          ]
        },
        {
          id: 'recipe_earl',
          name: 'アールグレイムース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '139', amountG: 556 }, // ベルコラーデ レ アンタンス
            { ingredientId: '140', amountG: 18 },  // ドイツ製ゼラチンゴールドエキストラ
            { ingredientId: '141', amountG: 400 }, // タカナシBasicMILK
            { ingredientId: '142', amountG: 54 },  // トワイニング アールグレイ
            { ingredientId: '143', amountG: 760 }  // 生クリーム 38%
          ]
        },
        {
          id: 'recipe_hibiscus_center',
          name: 'ハイビスカスセンター',
          basePortions: 1,
          ingredients: [
            { ingredientId: '144', amountG: 336 }, // 浄水
            { ingredientId: '145', amountG: 12 },  // 日本緑茶 ハイビスカス#153
            { ingredientId: '140', amountG: 10 },  // ドイツ製ゼラチンゴールドエキストラ
            { ingredientId: '126', amountG: 50 },  // フジ日本精糖 FNGS グラニュー糖
            { ingredientId: '146', amountG: 50 }   // シコリ 冷凍フランボワーズピューレ 加糖
          ]
        },
        {
          id: 'recipe_cheese_source',
          name: 'チーズソース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '147', amountG: 220 }, // タカナシクリームチーズ
            { ingredientId: '148', amountG: 292.6 }, // パティシエールA
            { ingredientId: '149', amountG: 72.6 },  // lait
            { ingredientId: '150', amountG: 4.62 }   // ドイツ板ゼラチンゴールド
          ]
        },
        {
          id: 'recipe_choc_comp',
          name: 'ショコラとグリオットチェリーのコンポジション',
          basePortions: 100,
          ingredients: [
            { ingredientId: '151', amountG: 52 }, // チョコレートムース
            { ingredientId: '152', amountG: 22 }, // 業務用ミルクアイス
            { ingredientId: '153', amountG: 7 },  // チェリーソース
            { ingredientId: '154', amountG: 4 },  // ミント
            { ingredientId: '155', amountG: 15 }, // チョコ飾り
            { ingredientId: '156', amountG: 3 },  // ホワイトチョコパウダー
            { ingredientId: '157', amountG: 2 }   // チェリーコンポート
          ]
        },
        {
          id: 'recipe_dessert1',
          name: 'デセールセット①',
          basePortions: 1,
          ingredients: [
            { ingredientId: '158', amountG: 1445 }, // ボワロン クレモンティーヌピューレ
            { ingredientId: '1', amountG: 296 },    // グラニュー糖
            { ingredientId: '144', amountG: 828 },  // 浄水
            { ingredientId: '159', amountG: 425 }   // LLオレンジ100%
          ]
        },
        {
          id: 'recipe_dessert_kiji',
          name: 'デセールルセット① 生地',
          basePortions: 1,
          ingredients: [
            { ingredientId: '160', amountG: 159 }, // クリーンパック鶏卵
            { ingredientId: '1', amountG: 106 },   // グラニュー糖
            { ingredientId: '161', amountG: 79 },  // スーパーバイオレット
            { ingredientId: '162', amountG: 13 },  // サンエイト オリジナルココア
            { ingredientId: '163', amountG: 26 },  // サラダ油
            { ingredientId: '164', amountG: 12.5 } // タカナシ ベーシックミルク
          ]
        },
        {
          id: 'recipe_dessert_center',
          name: 'デセールルセット センター',
          basePortions: 1,
          ingredients: [
            { ingredientId: '165', amountG: 432 }, // ポワロン グリオットチェリーホール
            { ingredientId: '166', amountG: 1000 },// フルティエ コレチェリー
            { ingredientId: '1', amountG: 260 },   // グラニュー糖
            { ingredientId: '167', amountG: 13 }   // アイスクリームペクチン
          ]
        },
        {
          id: 'recipe_dessert3_mousse',
          name: 'デセールルセット③ チョコレートムース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '168', amountG: 756 }, // ヴァローナ エキストラビター
            { ingredientId: '169', amountG: 378 }, // カレボー3815
            { ingredientId: '164', amountG: 655 }, // タカナシ ベーシックミルク
            { ingredientId: '170', amountG: 655 }, // 新スーパーフレッシュ36% (1)
            { ingredientId: '171', amountG: 328 }, // 加納卵黄
            { ingredientId: '1', amountG: 88 },    // グラニュー糖
            { ingredientId: '170', amountG: 1424 },// 新スーパーフレッシュ36% (2)
            { ingredientId: '172', amountG: 38 }   // ドイツゼラチン
          ]
        },
        {
          id: 'recipe_dessert_comp',
          name: 'デセールセット チェリーコンポート',
          basePortions: 1,
          ingredients: [
            { ingredientId: '173', amountG: 300 }, // ボワロン グリオットチェリーホール
            { ingredientId: '1', amountG: 100 },   // グラニュー糖
            { ingredientId: '144', amountG: 200 }, // 浄水
            { ingredientId: '174', amountG: 50 }   // フルティエ モレロチェリー
          ]
        },
        {
          id: 'recipe_dessert_choco_deco',
          name: 'デセールセット飾りチョコ',
          basePortions: 1,
          ingredients: [
            { ingredientId: '84', amountG: 50 },   // ロイヤルティーヌ
            { ingredientId: '175', amountG: 100 }, // カルボーW2カレット
            { ingredientId: '176', amountG: 35 },  // カルボー3815
            { ingredientId: '177', amountG: 10 }   // PCB チョコレート用色素 苺
          ]
        },
        {
          id: 'recipe_dessert_cherry_source',
          name: 'デセールセット チェリーソース',
          basePortions: 1,
          ingredients: [
            { ingredientId: '178', amountG: 64 },  // フルティエ ラズベリー
            { ingredientId: '174', amountG: 256 }, // フルティエ モレロチェリー
            { ingredientId: '1', amountG: 32 },    // グラニュー糖
            { ingredientId: '179', amountG: 3.2 }, // アイコクLMペクチン
            { ingredientId: '14', amountG: 160 }   // スブリモ
          ]
        },
        {
          id: 'recipe_dessert_white_powder',
          name: 'デセールセット ホワイトチョコパウダー',
          basePortions: 1,
          ingredients: [
            { ingredientId: '175', amountG: 50 },  // カルボーW2カレット
            { ingredientId: '83', amountG: 15 }    // マルトセック
          ]
        },
        {
          id: 'recipe_dessert1_v2',
          name: 'デセールセット① (Ver.2)', // 最後の重複レシピ名区別用
          basePortions: 1,
          ingredients: [
            { ingredientId: '180', amountG: 1000 },// ボワロン ミラベルピューレ
            { ingredientId: '1', amountG: 400 },   // グラニュー糖
            { ingredientId: '181', amountG: 100 }, // エルダーフラワーシロップ
            { ingredientId: '182', amountG: 50 },  // ボワロン ベルガモットピューレ
            { ingredientId: '144', amountG: 2000 } // 浄水
          ]
        }
      ];
      setRecipes(initialRecipes);
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(initialRecipes));
    }
  }, []);

  // 保存処理（Ingredients）
  const saveIngredients = (newIngredients: Ingredient[]) => {
    setIngredients(newIngredients);
    localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(newIngredients));
  };

  // 保存処理（Recipes）
  const saveRecipes = (newRecipes: Recipe[]) => {
    setRecipes(newRecipes);
    localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(newRecipes));
  };

  return {
    ingredients,
    recipes,
    saveIngredients,
    saveRecipes
  };
}
