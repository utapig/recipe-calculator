#!/usr/bin/env python3
import re
from pathlib import Path

md_path = Path('recipes.md')
md_content = md_path.read_text(encoding='utf-8')

# Split by recipe headers more carefully
# Extract all recipe sections
recipe_sections = []
lines = md_content.split('\n')

i = 0
while i < len(lines):
    line = lines[i].strip()
    
    # Look for recipe header (## or # but not # 全レシピ)
    if line.startswith('## ') or (line.startswith('#') and not line.startswith('## ') and 
                                    not line.startswith('# 全') and not line.startswith('###')):
        section = {
            'header': line,
            'lines': [],
            'start_line': i
        }
        
        # Collect lines until next header or end
        i += 1
        while i < len(lines):
            next_line = lines[i]
            next_stripped = next_line.strip()
            
            # Stop when we hit next header
            if next_stripped.startswith('## ') or (next_stripped.startswith('#') and 
                                                    not next_stripped.startswith('## ') and 
                                                    not next_stripped.startswith('# 全') and 
                                                    not next_stripped.startswith('###')):
                break
            
            # Collect ingredient lines
            if ':' in next_line and re.search(r'\d+(?:\.\d+)?\s*[gG](?:$|\s)', next_line):
                section['lines'].append(next_line)
            
            i += 1
        
        recipe_sections.append(section)
    else:
        i += 1

print(f"Total recipe sections: {len(recipe_sections)}")
print("\nFirst 20 recipes:")
for i, sec in enumerate(recipe_sections[:20], 1):
    recipe_name = re.sub(r'^#+\s*', '', sec['header'])
    ing_count = len(sec['lines'])
    print(f"{i}. {recipe_name} - {ing_count} ingredients")

print("\n\nLast 10 recipes:")
for i, sec in enumerate(recipe_sections[-10:], len(recipe_sections)-9):
    recipe_name = re.sub(r'^#+\s*', '', sec['header'])
    ing_count = len(sec['lines'])
    print(f"{i}. {recipe_name} - {ing_count} ingredients")

# Save parsed data for verification
with open('parsed_recipes.txt', 'w', encoding='utf-8') as f:
    for i, sec in enumerate(recipe_sections, 1):
        recipe_name = re.sub(r'^#+\s*', '', sec['header'])
        f.write(f"\n#{i}. {recipe_name}\n")
        for line in sec['lines'][:5]:
            f.write(f"  {line.strip()}\n")
        if len(sec['lines']) > 5:
            f.write(f"  ... and {len(sec['lines']) - 5} more\n")

print("\nParsed recipes saved to parsed_recipes.txt")
