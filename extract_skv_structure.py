#!/usr/bin/env python3
"""
Extract form structure from Skatteverket SKV 4600/461 bouppteckning blankett
"""
import json
import re
from pathlib import Path

def extract_from_json_file(filepath, source_name):
    """Extract and analyze JSON file content"""
    print(f"\n{'='*80}")
    print(f"SOURCE: {source_name}")
    print(f"{'='*80}\n")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            # Parse JSON
            data = json.load(f)

            # Handle different formats
            if isinstance(data, list) and data:
                content = data[0].get('text', '') if isinstance(data[0], dict) else str(data)
            else:
                content = str(data)
    except json.JSONDecodeError:
        print(f"Warning: Not valid JSON, reading as plain text...")
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

    # Now extract structural info from content

    # 1. Extract HTML headings
    print("SECTION HEADINGS (H1-H4):")
    print("-" * 80)
    headings = re.findall(r'<h([1-4])[^>]*>([^<]{3,150}?)</h\1>', content, re.IGNORECASE | re.DOTALL)
    seen = set()
    for level, text in headings:
        clean = re.sub(r'<[^>]+>|\s+', ' ', text).strip()[:120]
        if clean and clean not in seen and len(clean) > 3:
            print(f"  H{level}: {clean}")
            seen.add(clean)
            if len(seen) >= 50:
                break

    if not seen:
        print("  (No headings found)")

    # 2. Extract form fields and their labels
    print("\n\nFORM FIELDS & INPUTS:")
    print("-" * 80)

    # Look for common input patterns
    input_patterns = [
        r'<label[^>]*>([^<]{3,100}?)</label>',
        r'<input[^>]*(?:name|id)="([^"]{2,50})"',
        r'<textarea[^>]*(?:name|id)="([^"]{2,50})"',
        r'<select[^>]*(?:name|id)="([^"]{2,50})"',
        r'placeholder="([^"]{5,100}?)"'
    ]

    fields = set()
    for pattern in input_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        for match in matches:
            clean = re.sub(r'<[^>]+>|\s+', ' ', match).strip()[:100]
            if clean and clean not in fields:
                fields.add(clean)

    for i, field in enumerate(sorted(fields)[:40], 1):
        print(f"  {i}. {field}")

    if not fields:
        print("  (No form fields found)")

    # 3. Extract Swedish section markers
    print("\n\nSWEDISH SECTION MARKERS:")
    print("-" * 80)
    swedish = re.findall(r'(Del\s+[A-Z]|Avsnitt|Rubrik|Fält|Sektion|delen)[:\s]+([A-Z][^<\n]{3,80}?)', content, re.IGNORECASE)
    seen_swedish = set()
    for marker_type, text in swedish:
        clean = re.sub(r'<[^>]+>|\s+', ' ', text).strip()[:100]
        key = f"{marker_type.strip()}: {clean}"
        if key not in seen_swedish:
            print(f"  {marker_type.strip()}: {clean}")
            seen_swedish.add(key)
            if len(seen_swedish) >= 30:
                break

    if not seen_swedish:
        print("  (No Swedish sections found)")

    # 4. Extract table headers if present
    print("\n\nTABLE STRUCTURES:")
    print("-" * 80)
    tables = re.findall(r'<table[^>]*>.*?</table>', content, re.DOTALL | re.IGNORECASE)
    if tables:
        for t_idx, table in enumerate(tables[:5], 1):
            headers = re.findall(r'<th[^>]*>([^<]{3,100}?)</th>', table, re.IGNORECASE)
            if headers:
                print(f"  Table {t_idx} Headers:")
                for h in headers[:15]:
                    clean = re.sub(r'<[^>]+>|\s+', ' ', h).strip()
                    print(f"    - {clean}")
    else:
        print("  (No tables found)")

    # Stats
    print(f"\n\n[File size: {len(content):,} characters]")
    print(f"[Headings found: {len(seen)}]")
    print(f"[Form fields found: {len(fields)}]")


# Process all three files
files_to_process = [
    (
        "/var/folders/s2/xp2d5vm55y14z2q4knny0spw0000gn/T/claude-hostloop-plugins/99b2c39ab7364bfb/projects/-Users-benzinho-Library-Application-Support-Claude-local-agent-mode-sessions-1208b9a1-2a8e-43d3-aa19-f7dc17d644e1-1785f582-3a40-4935-b53e-812028f17fb7-local-63ca13d3-2c92-4773-9fd7-7f4f28c8eade-output-1atfc3602puwa/9197e64e-509b-4e27-9045-27105f337411/tool-results/mcp-workspace-web_fetch-1775876200507.txt",
        "SKV 4600 Info Page (official Skatteverket page)"
    ),
    (
        "/var/folders/s2/xp2d5vm55y14z2q4knny0spw0000gn/T/claude-hostloop-plugins/99b2c39ab7364bfb/projects/-Users-benzinho-Library-Application-Support-Claude-local-agent-mode-sessions-1208b9a1-2a8e-43d3-aa19-f7dc17d644e1-1785f582-3a40-4935-b53e-812028f17fb7-local-63ca13d3-2c92-4773-9fd7-7f4f28c8eade-output-1atfc3602puwa/9197e64e-509b-4e27-9045-27105f337411/tool-results/mcp-workspace-web_fetch-1775876201144.txt",
        "SKV 461 Instructions PDF"
    ),
    (
        "/var/folders/s2/xp2d5vm55y14z2q4knny0spw0000gn/T/claude-hostloop-plugins/99b2c39ab7364bfb/projects/-Users-benzinho-Library-Application-Support-Claude-local-agent-mode-sessions-1208b9a1-2a8e-43d3-aa19-f7dc17d644e1-1785f582-3a40-4935-b53e-812028f17fb7-local-63ca13d3-2c92-4773-9fd7-7f4f28c8eade-output-1atfc3602puwa/9197e64e-509b-4e27-9045-27105f337411/tool-results/mcp-workspace-web_fetch-1775876201694.txt",
        "blankett-se.com Description Page"
    ),
]

for filepath, source_name in files_to_process:
    if Path(filepath).exists():
        try:
            extract_from_json_file(filepath, source_name)
        except Exception as e:
            print(f"\nError processing {source_name}: {e}")
    else:
        print(f"\nFile not found: {filepath}")

print("\n" + "="*80)
print("EXTRACTION COMPLETE")
print("="*80)
