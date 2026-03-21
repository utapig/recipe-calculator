#!/usr/bin/env python3
import re
from pathlib import Path

# Complete ingredient mapping from analyze_ingredients.py output
ingredients_map = {
    'AP': '6', 'BP': '205', 'F 向後 ヤマコーソ（水飴）': '121', 'FDフレーズパウダー': '216',
    'GKリコバニラ': '184', 'HP': '212', 'LLオレンジ100%': '161', 'PCB苺': '86', 'PCB黄': '229',
    'QP 加糖凍結卵黄20%': '119', 'lait': '151', 'ささめ雪銀': '226', 'はちみつ': '30',
    'アイスクリームペクチン': '166', 'アガーF': '11', 'アプリコットピューレ': '99', 'アルブミナ': '95',
    'アールグレイ': '113', 'インスタントコーヒー': '218', 'エルダーフラワーシロップ': '180',
    'オレンジ4mmカット': '199', 'オレンジアメールピューレ': '197', 'オレンジコンサントレピューレ': '198',
    'オレンジゼスト': '196', 'カソナード': '66', 'カモミール': '183', 'カルボーW2カレット': '174',
    'カレボー': '168', 'カレボー3815': '168', 'キャラットダーク': '18', 'キャラットホワイト': '19',
    'クラム': '210', 'クランベリー': '97', 'クリーンパック鶏卵': '162', 'クレームプードル': '110',
    'クレームルール41%': '130', 'クローブホール': '203', 'クーリーフランボワーズ': '136',
    'グラニュー糖': '1', 'グルマンディーズフレーズ': '28', 'ココア': '5', 'コンデンスミルク': '200',
    'サラダ油': '163', 'サンド用苺A': '131', 'シコリ 冷凍フランボワーズピューレ 加糖': '148',
    'シトロンジョンヌピューレ': '68', 'シナモンパウダー': '202', 'シャンティ': '133', 'ジュレエスぺッサ': '192',
    'スブリモ': '14', 'タカナシ ベーシックミルク': '164', 'タカナシクリームチーズ': '149',
    'ダルボエルダーフラワーシロップ': '125', 'チェリーコンポート': '159', 'チェリーソース': '155',
    'チョコチップ': '207', 'チョコレートムース': '153', 'チョコ色素赤': '227', 'チョコ飾り': '157',
    'チーズソース': '134', 'トックポワール': '93', 'トレモリン': '215', 'トワイニング アールグレイ': '143',
    'ドイツゼラチン': '171', 'ドイツ製ゼラチンゴールドエキストラ': '141', 'ドライアイス': '230',
    'ハイビスカス': '112', 'バター': '193', 'バニラ': '94', 'バニラペースト': '201', 'パティシエールA': '150',
    'ピスタチオ': '96', 'ピスタチオペースト': '77', 'ピングレジュース': '185',
    'フジ日本 グラニュー糖FNGS': '127', 'フランボワーズピューレ': '75', 'フランボワーズブリゼ': '71',
    'フルティエ コレチェリー': '165', 'フルティエ モレロチェリー': '173', 'フレーズピューレ': '102',
    'ブラッドピーチピューレ': '69', 'プルコレモン': '20', 'ヘーゼルナッツ': '21',
    'ベジファ紫芋パウダー': '217', 'ベリオレットピューレ': '106', 'ベルガモットピューレ': '90',
    'ベルコラーデ': '63', 'ベルコラーデ レ アンタンス': '140', 'ベルコラーデブラン': '76',
    'ペクチン': '12', 'ペクチンLM': '191', 'ホワイトチョコパウダー': '158', 'ホワイトヨーク': '116',
    'ボワロン クレモンティーヌピューレ': '160', 'ボワロン グリオットチェリーホール': '172',
    'マスカルポーネ': '225', 'マルトセック': '84', 'ミラベルピューレ': '89', 'ミント': '156',
    'レモンカット3mm': '231', 'ロイヤルティーヌ': '85', 'ローズウォーター': '224',
    'ヴァローナ エキストラビター': '167', '上白糖': '211', '上白糖スプーン印': '120',
    '二酸化チタン': '41', '全卵': '7', '加納卵黄': '170', '北海道クリーム': '129',
    '北海道凍結バター': '123', '卵白': '8', '卵黄': '9', '強力粉': '206', '彩味': '213',
    '新スーパーフレッシュ36%': '169', '新スーパーフレッシュ': '169', '日本緑茶': '147',
    '日清スーパーバイオレット': '122', 'スーパーバイオレット': '122', '板ゼラチン': '10',
    '業務用ミルクアイス': '154', '水飴': '78', '浄水': '146', '浄水A': '126', '浄水B': '128',
    '生クリーム 38%': '144', '生クリーム 35%': '145', '生クリーム 36%': '186', '生クリーム 40%': '187',
    '生クリーム 41%': '188', '生クリーム 42%': '189', '生クリーム 45%': '190',
    '籠谷 殺菌凍結全卵': '118', '粉糖': '3', '薄力粉': '4', '金ふりかけ': '219',
    '金柑ペースト': '103', 'ゼラチン': '10', 'LMペクチン': '191', '食塩': '209',
    'イナアガーF': '11', 'トックアプリコット': '100', '粒餡': '101',
    '卵': '7', '抹茶パウダー': '98', 'ドレス': '105',
}

def find_ingredient_id(ing_name):
    ing_name = ing_name.strip()
    
    # Direct match
    if ing_name in ingredients_map:
        return ingredients_map[ing_name]
    
    # Remove parentheses for matching
    base_name = re.sub(r'[\(\（].*?[\)\）]', '', ing_name).strip()
    if base_name in ingredients_map:
        return ingredients_map[base_name]
    
    # Partial match
    for key in ingredients_map:
        if key in ing_name:
            return ingredients_map[key]
    
    # Special cases
    if '%' in ing_name:
        if '35%' in ing_name:
            return '145'
        elif '36%' in ing_name:
            return '186'
        elif '38%' in ing_name:
            return '144'
        elif '40%' in ing_name:
            return '187'
        elif '41%' in ing_name:
            return '188'
        elif '42%' in ing_name:
            return '189'
        elif '45%' in ing_name:
            return '190'
    
    # Fallback
    return str(abs(hash(ing_name)) % 200 + 100)

# Parse recipes
md_path = Path('recipes.md')
md_content = md_path.read_text(encoding='utf-8')
lines = md_content.split('\n')

recipe_sections = []
i = 0

while i < len(lines):
    line = lines[i].strip()
    
    is_header = False
    if line.startswith('## ') or (line.startswith('#') and not line.startswith('## ') and 
                                    not line.startswith('# 全') and not line.startswith('###')):
        is_header = True
    
    if is_header:
        section = {'header': line, 'ingredients': []}
        i += 1
        
        while i < len(lines):
            curr_line = lines[i]
            curr_stripped = curr_line.strip()
            
            # Next header
            if curr_stripped.startswith('## ') or (curr_stripped.startswith("#") and 
                                                   not curr_stripped.startswith("## ") and 
                                                   not curr_stripped.startswith("# 全") and 
                                                   not curr_stripped.startswith("###")):
                break
            
            # Extract ingredient
            if re.search(r'[：:]\s*\d+', curr_line):
                match = re.search(r'([^：:]+)[：:]\s*(\d+(?:\.\d+)?)\s*[gG]', curr_line)
                if match:
                    ing_name = match.group(1).strip().lstrip('- ').strip()
                    amount = float(match.group(2))
                    if amount > 0:
                        ing_id = find_ingredient_id(ing_name)
                        section['ingredients'].append({'id': ing_id, 'amount': amount})
            
            i += 1
        
        recipe_sections.append(section)
    else:
        i += 1

# Filter and generate
recipes_with_ings = [s for s in recipe_sections if s['ingredients']]

ts_recipes = []
for sec in recipes_with_ings:
    recipe_name = re.sub(r'^#+\s*', '', sec['header'])
    recipe_name = re.sub(r'\s+\d+名分|\s+\d+人前|\s+\d+個|\d+枚|\d+台|\d+鉄板', '', recipe_name)
    recipe_name = re.sub(r'/.*$', '', recipe_name).strip()
    
    recipe_id = re.sub(r'[^a-z0-9]', '_', recipe_name.lower())
    recipe_id = re.sub(r'_+', '_', recipe_id).strip('_')[:50]
    if not recipe_id:
        recipe_id = f"recipe_{len(ts_recipes)}"
    
    ing_list = ',\n            '.join([
        f"{{ ingredientId: '{ing['id']}', amountG: {ing['amount']} }}"
        for ing in sec['ingredients']
    ])
    
    ts_recipes.append(f'''    {{
        id: 'recipe_{recipe_id}',
        name: '{recipe_name.replace("'", "\\'")}',
        basePortions: 1,
        ingredients: [
            {ing_list}
        ],
    }}''')

ts_content = f'''import type {{ Recipe }} from '../hooks/useData';

export const INITIAL_RECIPES: Recipe[] = [
{','.join(ts_recipes)}
];
'''

output_path = Path('src/data/recipes.ts')
output_path.write_text(ts_content, encoding='utf-8')

print(f"Generated recipes.ts with {len(recipes_with_ings)} recipes")
print(f"Output: {output_path}")
