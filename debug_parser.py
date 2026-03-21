#!/usr/bin/env python3
import re
from pathlib import Path

md_path = Path('recipes.md')
md_content = md_path.read_text(encoding='utf-8')

lines = md_content.split('\n')
recipes = []
current_recipe = None
current_ingredients = []
recipe_count = 0

for i, line in enumerate(lines):
    stripped = line.strip()
    
    # Check for header
    is_header = False
    if stripped.startswith('## ') and not stripped.startswith('### '):
        is_header = True
    elif stripped.startswith('# ') and not stripped.startswith('## ') and \
         not stripped.startswith('# 全') and not stripped.startswith('###'):
        is_header = True
    
    if is_header:
        if current_recipe and current_ingredients:
            current_recipe['ingredients'] = current_ingredients
            recipes.append(current_recipe)
            recipe_count += 1
        
        recipe_name = re.sub(r'^#+\s*', '', stripped)
        recipe_name = re.sub(r'\s+\d+名分|\s+\d+人前|\s+\d+個|\d+枚|\d+台|\d+鉄板', '', recipe_name)
        recipe_name = re.sub(r'/.*$', '', recipe_name).strip()
        
        current_recipe = {
            'name': recipe_name,
            'line': i + 1
        }
        current_ingredients = []
        recipe_count += 1
        
        if recipe_count <= 10 or recipe_count > len([l for l in lines if l.strip().startswith('#') or l.strip().startswith('##')]) - 5:
            print(f"#{recipe_count} (Line {i+1}): {recipe_name}")
    
    # Check ingredients
    elif ':' in stripped and re.search(r'\d+(?:\.\d+)?\s*[gG](?:$|\s)', stripped):
        match = re.search(r'([^：:]+)[：:](\d+(?:\.\d+)?)\s*[gG]', stripped)
        if match:
            ing_name = match.group(1).strip().lstrip('- ').strip()
            amount = match.group(2)
            if current_recipe:
                current_ingredients.append(f"{ing_name}:{amount}g")

# Save last
if current_recipe and current_ingredients:
    current_recipe['ingredients'] = current_ingredients
    recipes.append(current_recipe)
    recipe_count += 1

print(f"\nTotal recipes found: {recipe_count}")
print(f"Recipes with ingredients: {len([r for r in recipes if r.get('ingredients')])}")

# Show sample recipe
if recipes:
    print(f"\nFirst recipe with ingredients:")
    for r in recipes:
        if r.get('ingredients'):
            print(f"  {r['name']} (Line {r['line']}) - {len(r['ingredients'])} ingredients")
            for ing in r['ingredients'][:3]:
                print(f"    - {ing}")
            break
