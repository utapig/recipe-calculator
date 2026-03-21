#!/usr/bin/env python3
import re
from pathlib import Path

# Parse ingredients.ts to extract all ingredient mappings
ing_path = Path('src/data/ingredients.ts')
ing_content = ing_path.read_text(encoding='utf-8')

# Extract ingredient definitions
ingredients = {}
matches = re.findall(r"id:\s*'(\d+)',\s*name:\s*'([^']*)'", ing_content)
for ing_id, ing_name in matches:
    ingredients[ing_name] = ing_id

print(f"Found {len(ingredients)} ingredients in ingredients.ts")
print("\nSample mappings:")
for ing_name, ing_id in list(ingredients.items())[:10]:
    print(f"  '{ing_name}' -> '{ing_id}'")

# Now read recipes.md and extract unique ingredient names
md_path = Path('recipes.md')
md_content = md_path.read_text(encoding='utf-8')
lines = md_content.split('\n')

unique_ingredients = set()
for line in lines:
    if re.search(r'[：:]\s*\d+', line):
        match = re.search(r'([^：:]+)[：:]\s*(\d+(?:\.\d+)?)\s*[gG]', line)
        if match:
            ing_name = match.group(1).strip().lstrip('- ').strip()
            unique_ingredients.add(ing_name)

print(f"\nFound {len(unique_ingredients)} unique ingredients in recipes.md")

# Check which ones are not in ingredients.ts
unmapped = []
for ing in sorted(unique_ingredients):
    if ing not in ingredients:
        # Try to find similar
        found = False
        for mapped_name, ing_id in ingredients.items():
            if mapped_name.lower() in ing.lower() or ing.lower() in mapped_name.lower():
                unmapped.append((ing, mapped_name, ing_id))
                found = True
                break
        if not found:
            unmapped.append((ing, None, None))

print(f"\nUnmapped or partially mapped ingredients: {len(unmapped)}")
print("\nTop 20 unmapped:")
for ing, mapped, ing_id in unmapped[:20]:
    if mapped:
        print(f"  '{ing}' -> '{mapped}' (ID: {ing_id})")
    else:
        print(f"  '{ing}' -> NOT FOUND")

# Generate Python dict for mapping
print("\n\nGenerated ingredient mapping for script:")
print("ingredients_map = {")
for ing in sorted(unique_ingredients):
    if ing in ingredients:
        print(f"    '{ing}': '{ingredients[ing]}',")
print("}")
