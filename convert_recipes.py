#!/usr/bin/env python3
import re
import json
from pathlib import Path

# Read recipes.md
md_path = Path('recipes.md')
md_content = md_path.read_text(encoding='utf-8')

# Parse recipes from markdown
recipes = []
current_recipe = None
current_ingredients = []

lines = md_content.split('\n')
i = 0
while i < len(lines):
    line = lines[i].strip()
    
    # Check for recipe header (## or # で始まるレシピ)
    if line.startswith('## ') or (line.startswith('# ') and not line.startswith('# 全レシピ')):
        # Save previous recipe if exists
        if current_recipe and current_ingredients:
            current_recipe['ingredients'] = current_ingredients
            recipes.append(current_recipe)
        
        # Extract recipe name
        if line.startswith('## '):
            recipe_name = line[3:].strip()
        else:
            recipe_name = line[2:].strip()
        
        # Clean up recipe name (remove trailing numbers like 60名分, 100人前, etc.)
        recipe_name = re.sub(r'\s+\d+名分|\s+\d+人前|\s+\d+個|\s+/.*', '', recipe_name)
        
        # Generate ID from recipe name
        recipe_id = re.sub(r'[^a-z0-9]', '_', recipe_name.lower())
        recipe_id = re.sub(r'_+', '_', recipe_id).strip('_')
        
        current_recipe = {
            'id': f'recipe_{recipe_id}',
            'name': recipe_name.strip(),
            'basePortions': 1,
            'ingredients': []
        }
        current_ingredients = []
    
    # Check for ingredients
    elif line.startswith('- ') and ':' in line and ('g' in line or 'G' in line):
        # Parse ingredient line
        match = re.match(r'-\s*([^:]+)：?(\d+(?:\.\d+)?)(g|G)', line)
        if not match:
            match = re.match(r'-\s*([^:]+):(\d+(?:\.\d+)?)(g|G)', line)
        
        if match:
            ingredient_name = match.group(1).strip()
            amount = float(match.group(2))
            
            # Find or create ingredient ID (simplified: using hash of name)
            ingredient_id = str(abs(hash(ingredient_name)) % 1000)
            
            current_ingredients.append({
                'ingredientId': ingredient_id,
                'amountG': amount
            })
    
    i += 1

# Save last recipe
if current_recipe and current_ingredients:
    current_recipe['ingredients'] = current_ingredients
    recipes.append(current_recipe)

print(f"Found {len(recipes)} recipes")

# Generate TypeScript file
ts_template = '''import type {{ Recipe }} from '../hooks/useData';

export const INITIAL_RECIPES: Recipe[] = [
{recipes_placeholder}
];
'''

def format_recipe(recipe):
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

recipes_content = ',\n'.join([format_recipe(r) for r in recipes])
ts_content = ts_template.replace('{recipes_placeholder}', recipes_content)

# Write output
output_path = Path('recipes_converted.ts')
output_path.write_text(ts_content, encoding='utf-8')

print(f"Converted recipes saved to {output_path}")
print("Sample of first 3 recipes:")
for r in recipes[:3]:
    print(f"  - {r['name']} ({len(r['ingredients'])} ingredients)")
