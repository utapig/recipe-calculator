#!/usr/bin/env python3
import re
from pathlib import Path

# Read recipes.md
md_path = Path('recipes.md')
md_content = md_path.read_text(encoding='utf-8')

lines = md_content.split('\n')

# Count recipe headers (## or single #)
recipe_headers = []
for i, line in enumerate(lines):
    # Look for recipe headers
    if line.startswith('## '):
        recipe_name = line[3:].strip()
        if recipe_name and not recipe_name.startswith('---'):
            recipe_headers.append((i, recipe_name, '##'))
    elif line.startswith('#') and not line.startswith('## ') and not line.startswith('# 全レシピ'):
        # Single # recipe (like #￥13ムースペシェ)
        recipe_name = line.lstrip('#').strip()
        if recipe_name and not recipe_name.startswith('---'):
            recipe_headers.append((i, recipe_name, '#'))

print(f"Found {len(recipe_headers)} recipe headers")
print("\nFirst 20 recipes:")
for i, (line_num, name, header_type) in enumerate(recipe_headers[:20], 1):
    print(f"{i}. [{header_type}] {name}")

print("\nLast 10 recipes:")
for i, (line_num, name, header_type) in enumerate(recipe_headers[-10:], len(recipe_headers)-9):
    print(f"{i}. [{header_type}] {name}")

# Now let's extract ingredients for a sample recipe
print("\n\nSample recipe parsing (first recipe):")
if recipe_headers:
    start_line = recipe_headers[0][0]
    end_line = recipe_headers[1][0] if len(recipe_headers) > 1 else len(lines)
    
    print(f"Recipe: {recipe_headers[0][1]}")
    print(f"Lines {start_line} to {end_line}:")
    
    ingredients = []
    for i in range(start_line, min(end_line, start_line + 30)):
        line = lines[i]
        # Look for ingredient patterns
        if re.search(r'：\d+|:\d+', line) and ('g' in line.lower()):
            print(f"  Line {i}: {line}")
            # Extract amount
            match = re.search(r'[：:](\d+(?:\.\d+)?)\s*g', line)
            if match:
                amount = match.group(1)
                ingredients.append({
                    'line': line,
                    'amount': amount
                })
    
    print(f"\nFound {len(ingredients)} ingredients")
