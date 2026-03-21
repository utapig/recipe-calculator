#!/usr/bin/env python3
import hashlib
import re
from pathlib import Path


FULLWIDTH_TRANSLATION = str.maketrans('０１２３４５６７８９．：＃', '0123456789.:#')

ALIASES = {
    '粒餡': '粒あん',
    'ブラットピーチピューレ（ﾌﾙﾃｨｴ）': 'ブラッドピーチピューレ（ﾌﾙﾃｨｴ）',
    'ホワイトピーチピュレ（ﾌﾙﾃｨｴ）': 'ホワイトピーチピューレ（ﾌﾙﾃｨｴ）',
    'タカナシBasicMILK': 'タカナシ ベーシックミルク',
    'フジ日本精糖 FNGS グラニュー糖': 'フジ日本 グラニュー糖FNGS',
    'ポワロン グリオットチェリーホール': 'ボワロン グリオットチェリーホール',
    'フランボピュレ': 'フランボワーズピューレ',
    'ベリオットピュレ': 'ベリオレットピューレ',
    'プリンカラメルソース': 'カラメルプリンソース',
    'SOSAラズべリークリスピー': 'ラズベリークリスピー(その他SOSA系)',
    'モレロチェリーピューレ（ﾌﾙﾃｨｴ）': 'モレロピューレ（ﾌﾙﾃｨｴ）',
    '38%フェテ': '生クリーム 38%',
    'ベルコレ': 'ベルコラーデ',
    'ポワールピューレ（ﾌﾙﾃｨｴ）': 'ペアーピューレ',
    'プティフール用コーン': 'ボンボン用コーン',
}


def normalize_text(value: str) -> str:
    return value.translate(FULLWIDTH_TRANSLATION).strip()


def is_header(line: str) -> bool:
    s = normalize_text(line)
    if s.startswith('## '):
        return True
    if s.startswith('#') and not s.startswith('## ') and not s.startswith('###'):
        return not re.match(r'^#\s*全レシピ', s)
    return False


def clean_recipe_name(header_line: str) -> str:
    name = normalize_text(header_line)
    name = re.sub(r'^[#]+\s*', '', name)
    name = re.sub(r'\s+\d+名分|\s+\d+人前|\s+\d+個|\d+枚|\d+台|\d+鉄板', '', name)
    name = re.sub(r'/.*$', '', name).strip()
    return name


def make_fallback_id(ingredient_name: str) -> str:
    digest = hashlib.md5(ingredient_name.encode('utf-8')).hexdigest()
    return str(300 + int(digest[:6], 16) % 700)


def parse_ingredients_map(ingredients_ts: str) -> dict[str, str]:
    ingredients_map: dict[str, str] = {}
    entries = re.findall(r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'", ingredients_ts)
    for ingredient_id, name in entries:
        raw_name = normalize_text(name)
        ingredients_map[raw_name] = ingredient_id

        compact = re.sub(r'\s+', '', raw_name)
        if compact:
            ingredients_map[compact] = ingredient_id

        base_name = re.sub(r'[\(\（].*?[\)\）]', '', raw_name).strip()
        if base_name:
            ingredients_map[base_name] = ingredient_id

    return ingredients_map


def find_ingredient_id(ingredient_name: str, ingredients_map: dict[str, str]) -> str:
    name = normalize_text(ingredient_name)
    name = re.sub(r'^[-・●]\s*', '', name).strip()
    name = ALIASES.get(name, name)
    name_compact = re.sub(r'\s+', '', name)
    base_name = re.sub(r'[\(\（].*?[\)\）]', '', name).strip()

    for key in (name, name_compact, base_name):
        if key and key in ingredients_map:
            return ingredients_map[key]

    for key, value in ingredients_map.items():
        if key and (key in name or name in key):
            return value

    return make_fallback_id(name)


def parse_ingredient_line(line: str):
    s = normalize_text(line)
    s = re.sub(r'^[-・●]\s*', '', s).strip()
    if not s:
        return None

    if s in ('材料：', '材料:', '材料（g）', '材料(g)', '材料'):
        return None

    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'^([^：:]+?)/\s*([0-9]+(?:\.[0-9]+)?\s*(?:g|G|kg|KG|個|枚|本|粒|台|袋|ケース|ℓ|L|ml|ML).*)$', r'\1:\2', s)

    m = re.match(r'^(.+?)[：:]\s*(?:約)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:g|G|kg|KG|個|枚|本|粒|台|袋|ケース|ℓ|L|ml|ML)?\s*$', s)
    if not m:
        m = re.match(r'^(.+?)(?:約)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:g|G|kg|KG|個|枚|本|粒|台|袋|ケース|ℓ|L|ml|ML)\s*$', s)
    if not m:
        return None

    ing_name = m.group(1).strip()
    try:
        amount = float(m.group(2))
    except ValueError:
        return None

    if amount <= 0:
        return None

    return ing_name, amount


def main():
    md_path = Path('recipes.md')
    ingredients_path = Path('src/data/ingredients.ts')
    output_path = Path('src/data/recipes.ts')

    lines = md_path.read_text(encoding='utf-8').split('\n')
    ingredients_map = parse_ingredients_map(ingredients_path.read_text(encoding='utf-8'))

    recipe_sections = []
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        if is_header(line):
            section = {
                'header': line,
                'ingredients': []
            }

            i += 1
            while i < len(lines):
                curr_line = lines[i]
                if is_header(curr_line.strip()):
                    break

                parsed = parse_ingredient_line(curr_line)
                if parsed:
                    ing_name, amount = parsed
                    ing_id = find_ingredient_id(ing_name, ingredients_map)
                    section['ingredients'].append({
                        'id': ing_id,
                        'amount': amount
                    })

                i += 1

            recipe_sections.append(section)
        else:
            i += 1

    print(f'Total recipe sections: {len(recipe_sections)}')
    print(f'Recipes with ingredients: {len([s for s in recipe_sections if s["ingredients"]])}')

    ts_recipes = []
    for index, sec in enumerate(recipe_sections, start=1):
        recipe_name = clean_recipe_name(sec['header'])
        recipe_id = f'recipe_{index:03d}'

        ing_list = ',\n            '.join([
            f"{{ ingredientId: '{ing['id']}', amountG: {ing['amount']} }}"
            for ing in sec['ingredients']
        ])

        ts_recipes.append(f'''    {{
        id: '{recipe_id}',
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

    output_path.write_text(ts_content, encoding='utf-8')
    print(f'Generated recipes.ts with {len(recipe_sections)} recipes')


if __name__ == '__main__':
    main()
