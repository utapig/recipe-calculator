#!/usr/bin/env python3
import re
from pathlib import Path

# Read files
md_path = Path('recipes.md')
md_content = md_path.read_text(encoding='utf-8')

# Parse ingredients mapping from ingredients.ts
ingredients_map = {
    'グラニュー糖': '1', 'トレハロース': '2', '粉糖': '3', '薄力粉': '4', 'ココア': '5',
    'AP': '6', '全卵': '7', '卵白': '8', '卵黄': '9', '板ゼラチン': '10', 'アガーF': '11',
    'ペクチン': '12', 'ミロワールヌートル': '13', 'スブリモ': '14', 'カラメルタブレット': '15',
    'キャラメルポップコーン': '16', '塩ポップコーン': '17', 'キャラットダーク': '18',
    'キャラットホワイト': '19', 'プルコレモン': '20', 'ヘーゼルナッツ': '21', 'アーモンド': '22',
    'ラフティスノウ': '23', 'パラチニット': '24', 'イナコルネール': '25', '竹炭パウダー': '26',
    'ラズベリークリスピー': '27', 'グルマンディーズフレーズ': '28', 'クーリー': '29',
    'はちみつ': '30', 'コーンスターチ': '31', '細巻チョコ': '32', 'リオス': '33',
    'アプソリュショコラ': '34', '二酸化チタン': '41', '液紅': '42', 'プラチョコ': '43',
    'ショートニング': '47', 'ひらひら金箔': '49', 'ひらひら銀箔': '50', 'ささめゆき金': '51',
    'スターダスト金ふり': '52', 'アラザン0号': '53', 'アラザン6号': '54',
    'パールクラッカンキャラメリア': '55', 'ロイヤルティーヌ': '85', 'PCB苺': '86',
    'グラハムビスケット': '65', 'カソナード': '66', 'ペカンナッツ': '67',
    'シトロンジョンヌピューレ': '68', 'ブラッドピーチピューレ': '69', 'ホワイトピーチピューレ': '70',
    'フランボワーズブリゼ': '71', 'グロゼイユ': '72', 'トックピーチ': '73', '白桃缶': '74',
    'フランボワーズピューレ': '75', 'ベルコラーデブラン': '76', 'ピスタチオペースト': '77',
    '水飴': '78', 'モレロピューレ': '79', 'グリオットホール': '80', 'エキストラビター': '81',
    'クレモンティーヌ': '82', 'マルトセック': '84', 'プチポワール': '87', 'ペアーピューレ': '88',
    'ミラベルピューレ': '89', 'ベルガモットピューレ': '90', 'カラメルプリンソース': '91',
    'トックポワール': '93', 'バニラ': '94', 'アルブミナ': '95', 'ピスタチオ': '96',
    'クランベリー': '97', '抹茶': '98', 'アプリコットピューレ': '99', 'トックアプリコット': '100',
    '粒あん': '101', 'フレーズピューレ': '102', '金柑ペースト': '103',
    'ドレス': '105', 'ベリオレットピューレ': '106', 'タカナシ': '164',
    'ネスカフェ': '108', 'クレームプードル': '110', 'キリ': '111', 'ハイビスカス': '112',
    'アールグレイ': '113', 'ドイツゼラチン': '171', 'バター': '193', 'オレンジ': '195',
    'BP': '205', '強力粉': '206', 'チョコチップ': '207', '食塩': '209', '上白糖': '211',
    'インスタントコーヒー': '218', 'ローズウォーター': '224', 'マスカルポーネ': '225',
    '生クリーム 35%': '145', '生クリーム 36%': '186', '生クリーム 38%': '144', '生クリーム 40%': '187',
    '生クリーム 41%': '188', '生クリーム 42%': '189', '生クリーム 45%': '190',
    'ペクチンLM': '191', 'ドイツ製ゼラチンゴールドエキストラ': '141',
    'パティシエール': '150', 'アイスクリームペクチン': '166',
    'ベルコラーデ': '63', 'ベルコラーデ レ アンタンス': '140',
    'タカナシクリームチーズ': '149', 'ドイツ板ゼラチン': '150',
    'オレンジゼスト': '196', 'コンデンスミルク': '200', 'バニラペースト': '201',
    'シナモンパウダー': '202', 'クローブホール': '203', 'クレームルール': '130',
    'ボワロン': '160', 'クレモンティーヌピューレ': '160', 'LLオレンジ': '161',
    'スーパーバイオレット': '122', '浄水': '146', 'ポワロン': '165', 'フルティエ': '165',
    'ヴァローナ': '167', 'カレボー': '168', '新スーパーフレッシュ': '169',
    'グリオットチェリーホール': '172', 'モレロチェリー': '173', 'カルボーW2': '174',
    'カルボー': '175', 'ピングレジュース': '185', 'レモンカット': '231',
    'レモンゼスト': '232', 'FDフレーズパウダー': '216', 'ベジファ紫芋パウダー': '217',
    '彩味': '213', '彩味いちご': '214', 'アローメージュ': '224',
    'ジュレエスぺッサ': '192', 'イナアガー': '11', 'イナコルネールF': '25',
}

def find_ingredient_id(ingredient_name):
    """Material name から ingredientId を探す"""
    ingredient_name = ingredient_name.strip()
    
    # 完全一致
    if ingredient_name in ingredients_map:
        return ingredients_map[ingredient_name]
    
    # 部分一致（括弧などを無視）
    base_name = re.sub(r'[\(\（].*?[\)\）]', '', ingredient_name).strip()
    if base_name in ingredients_map:
        return ingredients_map[base_name]
    
    # キーワード部分マッチ
    for key, value in ingredients_map.items():
        if key in ingredient_name or ingredient_name in key:
            return value
    
    # 見つからない場合は、材料名のハッシュから番号を生成
    return str(abs(hash(ingredient_name)) % 200 + 100)

# Parse recipes from markdown  
lines = md_content.split('\n')
recipes = []
current_recipe = None
current_ingredients = []

for i, line in enumerate(lines):
    stripped = line.strip()
    
    # Recipe headers: ## or # (but not # 全レシピ or ### or #### etc)
    is_header = False
    if stripped.startswith('## ') and not stripped.startswith('### '):
        is_header = True
    elif stripped.startswith('# ') and not stripped.startswith('## ') and \
         not stripped.startswith('# 全') and not stripped.startswith('###'):
        is_header = True
    
    if is_header:
        # Save previous recipe
        if current_recipe and current_ingredients:
            current_recipe['ingredients'] = current_ingredients
            recipes.append(current_recipe)
        
        # New recipe
        recipe_name = re.sub(r'^#+\s*', '', stripped)
        recipe_name = re.sub(r'\s+\d+名分|\s+\d+人前|\s+\d+個|\d+枚|\d+台|\d+鉄板', '', recipe_name)
        recipe_name = re.sub(r'/.*$', '', recipe_name).strip()  # Remove /...
        
        recipe_id = re.sub(r'[^a-z0-9]', '_', recipe_name.lower())
        recipe_id = re.sub(r'_+', '_', recipe_id).strip('_')[:50]
        
        current_recipe = {
            'id': f'recipe_{recipe_id}',
            'name': recipe_name.strip(),
            'basePortions': 1,
            'ingredients': []
        }
        current_ingredients = []
    
    # Ingredient lines (with various formats)
    elif ':' in stripped and re.search(r'\d+(?:\.\d+)?\s*[gG](?:$|\s)', stripped):
        # Match patterns like "材料名:数値g", "材料名: 数値g", "- 材料名：数値g"
        match = re.search(r'([^：:]+)[：:](\d+(?:\.\d+)?)\s*[gG]', stripped)
        if match:
            ing_name = match.group(1).strip().lstrip('- ').strip()
            amount = float(match.group(2))
            
            ing_id = find_ingredient_id(ing_name)
            if amount > 0:  # Skip zero amounts
                current_ingredients.append({
                    'ingredientId': ing_id,
                    'amountG': amount
                })

# Save last recipe
if current_recipe and current_ingredients:
    current_recipe['ingredients'] = current_ingredients
    recipes.append(current_recipe)

print(f"Extracted {len(recipes)} recipes")
print("\nRecipes with 0 ingredients (to review):")
empty_count = 0
for r in recipes:
    if not r['ingredients']:
        print(f"  - {r['name']}")
        empty_count += 1
print(f"Total: {empty_count}")

# Generate TypeScript code
def format_recipe(recipe):
    if not recipe['ingredients']:
        ingredients_str = ''
    else:
        ingredients_str = ',\n            '.join([
            f"{{ ingredientId: '{ing['ingredientId']}', amountG: {ing['amountG']} }}"
            for ing in recipe['ingredients']
        ])
    
    return f'''    {{
        id: '{recipe['id']}',
        name: '{recipe['name'].replace("'", "\\'")}',
        basePortions: {recipe['basePortions']},
        ingredients: [
            {ingredients_str}
        ],
    }}'''

recipes_ts = ',\n'.join([format_recipe(r) for r in recipes if r['ingredients']])

ts_content = f'''import type {{ Recipe }} from '../hooks/useData';

export const INITIAL_RECIPES: Recipe[] = [
{recipes_ts}
];
'''

# Write output
output_path = Path('src/data/recipes.ts')
output_path.write_text(ts_content, encoding='utf-8')

print(f"\nGenerated recipes.ts with {len([r for r in recipes if r['ingredients']])} recipes")
print(f"Output saved to: {output_path}")
